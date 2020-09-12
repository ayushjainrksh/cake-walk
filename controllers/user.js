const User = require("../models/user");

const ping = async (req, res) => {
  return res.send("pong");
};

module.exports = {
  ping,
};
