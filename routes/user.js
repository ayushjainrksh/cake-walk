const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/ping", userController.ping);
router.post("/create", userController.createUser);

module.exports = router;
