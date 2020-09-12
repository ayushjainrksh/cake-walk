const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/ping", function (req, res) {
  res.send("pong");
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log(`Server started on port ${PORT}...`);
});
