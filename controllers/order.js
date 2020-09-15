const Order = require("../models/order");
const Item = require("../models/item");

//To calculate first Mile distance
const getDeliveryExecutiveDistanceFromStore = async () => {
  //TODO: Use google maps API to locate the postition of the delivery executive
  // and calculate their distance from store
  return Math.floor(Math.random() * 10) + 1; //in km
};

//To find order preparation time
const getPrepTime = async (items) => {
  let prepTime = 0;
  //Sum of preparation time of all items
  for (let itemIx = 0; itemIx < items.length; itemIx++) {
    const item = await Item.findById(items[itemIx]);
    prepTime += item.prepTime;
  }
  return prepTime;
};

//To get time required to travel a certain distance
const getTimeForDistance = async (distance) => {
  //TODO: Use google maps API to track and find orders
  const multiplier = 1.5;
  return distance * multiplier * 60 * 1000; //in ms
};

//Find and assign a delivery executive for the order
const findAvailable = async (deliveryEx, clientDistanceFromStore, items) => {
  let minDeliveryTime = null;
  //TODO: Replace this with filter
  for (let exec = 0; exec < deliveryEx.length; exec++) {
    //Check for least delivery time using nearest mile algorithm
    let assignmentTime = 0; //Time taken to find a delivery executive
    let firstMileTime = 0; //Time taken by delivery executive to reach bakery
    let lastMileTime = 0; //Time taken by delivery executive from bakery to client location
    let prepTime = 0; //Time taken to prepare the order
    let deliveryTime = 0; //Total time taken (ETA)

    //Fetch all orders assigned to a delivery executive
    const orders = await Order.find({
      assignedTo: deliveryEx[exec]._id,
      status: 1,
    });

    //Calculate assignmentTime from previous eta
    if (orders.length !== 0) {
      for (let eachOrder = 0; eachOrder < orders.length; eachOrder++) {
        assignmentTime = Math.max(orders[eachOrder].eta, assignmentTime);
      }
    }

    //Get firstMileTime and the lastMileTime
    firstMileTime = await getTimeForDistance(
      await getDeliveryExecutiveDistanceFromStore()
    );
    lastMileTime = await getTimeForDistance(clientDistanceFromStore);

    //Calculate preparation time
    prepTime = await getPrepTime(items);

    //Nearest mile algorithm to find optimal delivery time
    deliveryTime =
      Math.max(assignmentTime + firstMileTime, prepTime) + lastMileTime;

    //Find the executive who can deliver order in minimum time
    //(Can assign order to the executive travelling to the same location)
    if (minDeliveryTime) {
      if (minDeliveryTime.deliveryTime > deliveryTime) {
        minDeliveryTime.deliveryTime = deliveryTime;
        minDeliveryTime.deliveryEx = deliveryEx[exec]._id;
      }
    } else {
      minDeliveryTime = {};
      minDeliveryTime["deliveryTime"] = deliveryTime;
      minDeliveryTime["deliveryEx"] = deliveryEx[exec]._id;
    }
  }
  return minDeliveryTime;
};

const placeOrder = async (req, res) => {
  let body = req.body;
  try {
    //Find list of delivery executives
    let deliveryEx = await User.find({ role: 2 });

    //Calculate minimum delivery time and assign employee
    const minDeliveryTime = await findAvailable(
      deliveryEx,
      req.body.clientDistanceFromStore,
      req.body.items
    );

    body["assignedTo"] = minDeliveryTime.deliveryEx;
    body["locationOfDeliveryEx"] = 10; //getLoc();
    body[
      "storeDistanceFromDeliveryEx"
    ] = await getDeliveryExecutiveDistanceFromStore();

    //Calculated ETA (minimum delivery time) in ms
    body["eta"] = minDeliveryTime.deliveryTime;

    //Place order
    const order = await Order.create(req.body);
    if (order) {
      console.log("Order placed");
      return res.send({ order: order, message: "Order placed successfully" });
    }
    return res.send({
      order: null,
      message: "Something went wrong, try again",
    });
  } catch (err) {
    return res.send({ err: err, message: "Failed to place the order" });
  }
};

const getOrderById = async (req, res) => {
  try {
    let order;
    if (req.user.access === "root") {
      order = await Order.findById(req.params.id).populate([
        "items",
        "placedBy",
        "assignedTo",
      ]);
    } else if (req.user.access === "user") {
      order = await Order.findById(req.params.id).populate([
        "items",
        "placedBy",
        "assignedTo",
      ]);
      if (order.placedBy !== req.user.id)
        return res.send({
          result: null,
          message: "You haven't placed any such order",
        });
    } else if (req.user.access === "exec") {
      order = await Order.findById(req.params.id).populate([
        "items",
        "placedBy",
        "assignedTo",
      ]);
      if (order.assignedTo !== req.user.id)
        return res.send({
          result: null,
          message: "You haven't been assigned any such order",
        });
    }
    if (order) {
      return res.send({ order: order, message: "Found order" });
    }
    return res.send({ order: null, message: "Order does not exists" });
  } catch (err) {
    return res.send({ err: err, message: "Failed to fetch the order" });
  }
};

const getAll = async (req, res) => {
  try {
    let order;
    if (req.user.access === "root") {
      order = await Order.find().populate(["items", "placedBy", "assignedTo"]);
    } else if (req.user.access === "user") {
      order = await Order.find({ placedBy: req.user.id }).populate([
        "items",
        "placedBy",
        "assignedTo",
      ]);
    } else if (req.user.access === "exec") {
      order = await Order.find({ assignedTo: req.user.id }).populate([
        "items",
        "placedBy",
        "assignedTo",
      ]);
    }
    return res.send({ result: order, message: "Found orders" });
  } catch (err) {
    return res.send({ err: err, message: "Failed to find orders" });
  }
};

//Mark orders as delivered or undelivered
const updateStatus = async (req, res) => {
  let body = req.body;
  try {
    if (req.user.access === "root") {
      //Root user can update any order
      let order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: body.status, paymentStatus: body.paymentStatus, eta: 0 },
        { new: true }
      );
      if (order)
        return res.send({ result: order, message: "Order update successful" });
    } else if (req.user.access === "exec") {
      //Delivery executives can update thier own orders only
      let order = await Order.findById(req.params.id);
      if (order && String(order.assignedTo) === req.user.id) {
        order.status = body.status;
        order.paymentStatus = body.paymentStatus;
        order.eta = body.eta;
        order.save();
        return res.send({ result: order, message: "Order update successful" });
      }
    }
    return res.send({ result: null, message: "Failed to update order" });
  } catch (err) {
    return res.send({ err: err, message: "Order update failed" });
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  getAll,
  updateStatus,
};
