const User = require("../models/user");

const ping = async (req, res) => {
  return res.send("pong");
};

const createUser = async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const user = await User.create({ firstName, lastName });
    if (!user) {
      return res.send({ err: "Failed to create user" });
    }
    console.log("User added successfully");
    return res.send({ user: user });
  } catch (err) {
    return res.send({ err: err });
  }
};

module.exports = {
  ping,
  createUser,
};
