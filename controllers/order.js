const Order = require("../models/order");

const placeOrder = async (req, res) => {
  try {
    const order = Order.create(req.body);
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
    const order = await Order.find().populate(["items", "placedBy"]);
    return res.send({ order: order });
  } catch (err) {
    console.log("getAll -> err", err);
    return res.send({ err: err });
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  getAll,
};
