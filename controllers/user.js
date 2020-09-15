const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//Test route
const ping = async (req, res) => {
  return res.send("pong");
};

//Create user logic
const createUser = async (req, res) => {
  let body = req.body;
  try {
    let user = await User.findOne({ email: body.email });
    if (user !== null) {
      return res.send({ err: "User already exists!" });
    }
    try {
      const hash = await bcrypt.hash(body.password, 10);
      try {
        body["password"] = hash;
        if (body.role !== 0) {
          let newUser = new User(body);
          const savedUser = await newUser.save();
          return res.send({
            result: savedUser,
            message: "User created successfully!",
          });
        } else {
          return res.sendStatus(401);
        }
      } catch (err) {
        return res.send({ err: "Error while creating user" });
      }
    } catch (err) {
      return res.send({ err: "Error while generating hash" });
    }
  } catch (err) {
    return res.send({ err: "Error while checking for existing user" });
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
        return res.send({
          result: savedUser,
          message: "User created successfully!",
        });
      } catch (err) {
        return res.send({ err: "Error while creating user" });
      }
    } catch (err) {
      return res.send({ err: "Error while generating hash" });
    }
  } catch (err) {
    return res.send({ err: "Error while checking for existing user" });
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
            return res.send({
              err: error,
              message: "Error while finding the user.",
            });
          }
        } catch (error) {
          return res.send({
            err: error,
            message: "Error signing token",
          });
        }
      } else {
        return res.send({
          result: null,
          message: "Incorrect password",
        });
      }
    } catch (error) {
      return res.send({
        result: error,
        message: "Error while comparing hashes",
      });
    }
  } catch (error) {
    log.info(`Can not find user with email : ${req.body.email}`);
    return res.send({
      error: error,
      message: "User does not exists with given email id.",
    });
  }
};

//Can be accessed by root user
const getAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.send({ users: users, message: `${users.length} users found` });
  } catch (err) {
    return res.send({ err: err });
  }
};

module.exports = {
  ping,
  createUser,
  createRootUser,
  login,
  getAll,
};
