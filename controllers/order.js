const Order = require("../models/order");
const Item = require("../models/item");
const bodyParser = require("body-parser");

const getPrepTime = async (items) => {
  let prepTime = 0;
  for (let itemIx = 0; itemIx < items.length; itemIx++) {
    const item = await Item.findById(items[itemIx]);
    prepTime += item.prepTime;
  }
  return prepTime; //5 mins
};

const getTimeForDistance = async (clientDistanceFromStore) => {
  const multiplier = 1.5;
  return clientDistanceFromStore * multiplier * 60 * 1000; //in ms
};

const findAvailable = async (deliveryEx, clientDistanceFromStore, items) => {
  let minDeliveryTime = null;
  //TODO: Replace this with filter
  for (let exec = 0; exec < deliveryEx.length; exec++) {
    let assignmentTime = 0;
    let firstMileTime = 0;
    let lastMileTime = 0;
    let prepTime = 0;
    let deliveryTime = 0;

    const orders = await Order.find({
      assignedTo: deliveryEx[exec]._id,
      status: 1,
    });
    if (orders.length !== 0) {
      for (let eachOrder = 0; eachOrder < orders.length; eachOrder++) {
        assignmentTime += orders[eachOrder].eta;
      }
    }
    console.log("findAvailable -> assignmentTime", assignmentTime);
    firstMileTime = await getTimeForDistance(clientDistanceFromStore);
    lastMileTime = firstMileTime;
    prepTime = await getPrepTime(items);
    deliveryTime =
      Math.max(assignmentTime + firstMileTime, prepTime) + lastMileTime;
    console.log("findAvailable -> deliveryTime", deliveryTime);
    if (minDeliveryTime) {
      console.log("not empty");
      if (minDeliveryTime.deliveryTime > deliveryTime) {
        minDeliveryTime.deliveryTime = deliveryTime;
        minDeliveryTime.deliveryEx = deliveryEx[exec]._id;
      }
    } else {
      console.log("empty");
      minDeliveryTime = {};
      minDeliveryTime["deliveryTime"] = deliveryTime;
      minDeliveryTime["deliveryEx"] = deliveryEx[exec]._id;
    }
  }
  console.log("findAvailable -> minDeliveryTime", minDeliveryTime);
  return minDeliveryTime;
};

const placeOrder = async (req, res) => {
  let body = req.body;
  try {
    let deliveryEx = await User.find({ role: 2 });
    console.log(deliveryEx);
    const minDeliveryTime = await findAvailable(
      deliveryEx,
      req.body.clientDistanceFromStore,
      req.body.items
    );
    console.log(minDeliveryTime);
    body["assignedTo"] = minDeliveryTime.deliveryEx;
    body["locationOfDeliveryEx"] = 10; //getLoc(availableEx);
    body["storeDistanceFromDeliveryEx"] = 15;
    body["eta"] = minDeliveryTime.deliveryTime; //30mins

    const order = await Order.create(req.body);
    if (order) {
      console.log("Order placed");
      return res.send({ order: order });
    }
    return res.send({ err: "couldnt place order" });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = Order.findById(req.params.id);
    if (order) {
      console.log("Found order");
      return res.send({ order: order });
    }
    return res.send({ err: "couldnt find order" });
  } catch (err) {
    console.log(err);
    return res.send({ err: err });
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
    return res.send({ orders: order });
  } catch (err) {
    console.log("getAll -> err", err);
    return res.send({ err: err });
  }
};

const updateStatus = async (req, res) => {
  let body = req.body;
  try {
    if (req.user.access === "root") {
      let order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: body.status, paymentStatus: body.paymentStatus, eta: 0 },
        { new: true }
      );
      if (order) return res.send({ order: order });
    } else if (req.user.access === "exec") {
      let order = await Order.findById(req.params.id);
      if (order && String(order.assignedTo) === req.user.id) {
        order.status = body.status;
        order.paymentStatus = body.paymentStatus;
        order.eta = body.eta;
        order.save();
      }
      return res.send({ order: order });
    }
  } catch (err) {
    console.log("updateStatus -> err", err);
    return res.send({ err: err });
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  getAll,
  updateStatus,
};
