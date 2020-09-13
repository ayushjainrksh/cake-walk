const Item = require("../models/item");

const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    if (item) {
      console.log("Item created successfully");
      return res.send({ item: item });
    }
  } catch (err) {
    console.log("createItem -> err", err);
    return res.send({ err: err });
  }
};

const getAll = async (req, res) => {
  try {
    const item = await Item.find();
    return res.send({ items: item });
  } catch (err) {
    console.log("getAll -> err", err);
    return res.send({ err: err });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    return res.send({ item: item });
  } catch (err) {
    console.log("getAll -> err", err);
    return res.send({ err: err });
  }
};

module.exports = {
  createItem,
  getAll,
  getItemById,
};
