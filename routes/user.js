const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const {
  rootAccess,
  accessControl,
  authenticateUser,
} = require("../utils/middlewares");

router.get("/ping", userController.ping);
router.post("/create", userController.createUser);
router.post(
  "/createRootUser",
  authenticateUser,
  rootAccess,
  accessControl,
  userController.createRootUser
);
router.post("/login", userController.login);
router.get(
  "/getAll",
  authenticateUser,
  rootAccess,
  accessControl,
  userController.getAll
);

module.exports = router;
