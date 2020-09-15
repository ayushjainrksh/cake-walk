const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//Logs each request to console
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

//Default endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

//Check for user log in
const authenticateUser = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    //Get Bearer token
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ENCRYPTION, (err, user) => {
      if (err) {
        return response.sendStatus(403); //Forbidden
      }
      request.user = user;
      next();
    });
  } else {
    response.sendStatus(401); //Unauthorized
  }
};

//Implement different levels of access control
const accessControl = async (request, response, next) => {
  const user = await User.findById(request.user.id);
  if (user.role === 0) {
    console.log("Access Level: Root");
    request.user.access = "root";
  } else if (user.role === 1) {
    console.log("Access Level: User");
    request.user.access = "user";
  } else if (user.role === 2) {
    console.log("Access Level: Executive");
    request.user.access = "exec";
  } else {
    console.log("WTF! How did you make an account?");
    request.user.access = "denied";
  }

  //Check if a particular level of access is granted
  if (response.locals.access.includes(request.user.access)) next();
  else response.sendStatus(401); //Unauthorized
};

const rootAccess = (request, response, next) => {
  if (response.locals.access) {
    response.locals.access.push("root");
  } else {
    response.locals.access = ["root"];
  }
  next();
};

const userAccess = (request, response, next) => {
  if (response.locals.access) {
    response.locals.access.push("user");
  } else {
    response.locals.access = ["user"];
  }
  next();
};

const execAccess = (request, response, next) => {
  if (response.locals.access) {
    response.locals.access.push("exec");
  } else {
    response.locals.access = ["exec"];
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  authenticateUser,
  rootAccess,
  userAccess,
  execAccess,
  accessControl,
};
