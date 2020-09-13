const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      //0 - root
      //1 - user
      //2 - delivery executive
      type: Number,
      enum: [0, 1, 2],
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
