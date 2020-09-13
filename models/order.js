const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    placedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", //role should be user
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User", //role should be delivery executive
    },
    status: {
      //0 - Canceled by user or failed to deliver
      //1 - (Ordered) Waiting to deliver,
      //2 - Delivered,
      type: Number,
      enum: [0, 1, 2],
      required: true,
      default: 1,
    },
    paymentStatus: {
      //0 - failed
      //1 - to be paid (pay on delivery)
      //2 - paid
      type: Number,
      enum: [0, 1, 2],
      required: true,
      default: 1,
    },
    eta: {
      //in ms
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = Order = mongoose.model("Order", OrderSchema);
