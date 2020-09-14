const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

require("dotenv").config();

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
        if (body.role !== 0) {
          let newUser = new User(body);
          const savedUser = await newUser.save();
          console.log("User created successfully");
          return res.send({ user: savedUser });
        } else {
          return res.sendStatus(401);
        }
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

const createRootUser = async (req, res) => {
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

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "password"
    );

    try {
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (isMatch) {
        const payload = {
          id: user._id,
          user,
        };

        try {
          const token = jwt.sign(payload, process.env.JWT_ENCRYPTION, {
            expiresIn: process.env.JWT_EXPIRATION,
          });

          console.log(`User logged in: ${req.body.email}`);
          try {
            const newUser = await User.findById(user._id);
            return res.send({
              success: true,
              result: newUser._id,
              token: "Bearer " + token,
              message: "Logged In",
            });
          } catch (error) {
            console.log(`Error while updating user`);
            return res.send({
              result: err,
              success: false,
              message: "Error while updating the user.",
              token: null,
            });
          }
        } catch (error) {
          console.log(`Error while jwt signing`);
          return res.send({
            result: null,
            success: false,
            error: "Error signing token",
          });
        }
      } else {
        return res.send({
          success: false,
          message: "Password incorrect",
          result: null,
          token: null,
        });
      }
    } catch (error) {
      return res.send({
        result: error,
        success: false,
        message: "Error while comparing hashes",
        token: null,
      });
    }
  } catch (error) {
    log.info(`Can not find user with email : ${req.body.email}`);
    return res.send({
      result: null,
      success: false,
      message: "User does not exists with given email id.",
      token: null,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (err) {
    return res.send(err);
  }
};

module.exports = {
  ping,
  createUser,
  createRootUser,
  login,
  getAll,
};
