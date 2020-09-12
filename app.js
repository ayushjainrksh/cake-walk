const { request } = require("express");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const middlewares = require("./utils/middlewares");
const mongoose = require("mongoose");

try {
  mongoose.connect("mongodb://localhost:27017/cake-walk-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log("Connected to MongoDB server...");
} catch (error) {
  console.log("Error in connection to mongodb : ", error.message);
}

app.use(middlewares.requestLogger);

app.get("/ping", function (req, res) {
  res.send("pong");
});

app.use(middlewares.unknownEndpoint);

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log(`Server started on port ${PORT}...`);
});
