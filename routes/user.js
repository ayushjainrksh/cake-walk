const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/ping", userController.ping);

module.exports = router;
