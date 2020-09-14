const Order = require("../models/order");

const findAvailable = async (deliveryEx) => {
  //TODO: Replace this with filter
  for (let exec = 0; exec < deliveryEx.length; exec++) {
    const orders = await Order.find({
      assignedTo: deliveryEx[exec]._id,
      status: 1,
    });
    if (orders.length === 0) {
      return deliveryEx[exec];
    }
  }
  return;
};

const placeOrder = async (req, res) => {
  let body = req.body;
  try {
    let deliveryEx = await User.find({ role: 2 });
    console.log(deliveryEx);
    const availableEx = await findAvailable(deliveryEx);
    // console.log(availableEx);
    if (availableEx) {
      body["assignedTo"] = availableEx._id;
      body["locationOfDeliveryEx"] = 10; //getLoc(availableEx);
      body["storeDistanceFromDeliveryEx"] = 15;
      body["eta"] = 30 * 60 * 1000; //30mins
    }
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
    const order = await Order.find().populate([
      "items",
      "placedBy",
      "assignedTo",
    ]);
    return res.send({ orders: order });
  } catch (err) {
    console.log("getAll -> err", err);
    return res.send({ err: err });
  }
};

const updateStatus = async (req, res) => {
  let body = req.body;
  try {
    let order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: body.status, paymentStatus: body.paymentStatus, eta: 0 },
      { new: true }
    );
    if (order) return res.send({ order: order });
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
