const Item = require("../models/item");

const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    if (item) {
      return res.send({ result: item, message: "Item created successfully" });
    }
    return res.send({
      result: null,
      message: "Something went wrong. Please try again.",
    });
  } catch (err) {
    return res.send({ err: err, message: "Error while adding item" });
  }
};

const getAll = async (req, res) => {
  try {
    const item = await Item.find();
    if (item)
      return res.send({ result: item, message: `${item.length} items found` });
    return res.send({ result: null, message: `No items found` });
  } catch (err) {
    return res.send({ err: err, message: "Error while finding items" });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) return res.send({ result: item, message: "Found item" });
    return res.send({ result: null, message: "No such item" });
  } catch (err) {
    return res.send({ err: err, message: "Error while finding item" });
  }
};

module.exports = {
  createItem,
  getAll,
  getItemById,
};
