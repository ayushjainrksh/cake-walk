const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/ping", userController.ping);
router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.get("/getAll", userController.getAll);

module.exports = router;
