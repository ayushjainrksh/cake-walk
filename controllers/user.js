const User = require("../models/user");

const bcrypt = require("bcryptjs");

const ping = async (req, res) => {
  return res.send("pong");
};

const createUser = async (req, res) => {
  let body = req.body;
  try {
    let user = await User.findOne({ email: body.email });
    if (user !== null) {
      return res.send({ err: "User already exists" });
    }
    try {
      const hash = await bcrypt.hash(body.password, 10);
      try {
        body["password"] = hash;
        let newUser = new User(body);
        const savedUser = await newUser.save();
        console.log("User created successfully");

        return res.send({ user: savedUser });
      } catch (err) {
        console.log("createUser -> err", err);
        return res.send({ err: "Error in creating user" });
      }
    } catch (err) {
      console.log("createUser -> err", err);
      return res.send({ err: "Error while generating hash" });
    }
  } catch (err) {
    console.log("createUser -> err", err);
    return res.send({ err: err });
  }
};

module.exports = {
  ping,
  createUser,
};
