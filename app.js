const express = require("express");
const app = express();
const middlewares = require("./utils/middlewares");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(middlewares.requestLogger);

require("./routes/main")(app);

app.use(middlewares.unknownEndpoint);

module.exports = app;
