const mongoose = require("mongoose");

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  numAvailable: {
    type: Number,
  },
  prepTime: {
    type: Number, //in ms
  },
});

module.exports = Item = mongoose.model("Item", ItemSchema);
