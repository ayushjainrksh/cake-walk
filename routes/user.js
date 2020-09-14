const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const {
  rootAccess,
  accessControl,
  authenticateUser,
} = require("../utils/middlewares");

/**
 * GET /ping
 * Test API
 */
router.get("/ping", userController.ping);

/**
 * POST /create
 * Create a non root user
 */
router.post("/create", userController.createUser);

/**
 * POST /createRootUser
 * A root user can create a new root user
 */
router.post(
  "/createRootUser",
  authenticateUser,
  rootAccess,
  accessControl,
  userController.createRootUser
);

/**
 * POST /login
 * Login in to your account
 */
router.post("/login", userController.login);

/**
 * GET /getAll
 * Root user can access list of users
 */
router.get(
  "/getAll",
  authenticateUser,
  rootAccess,
  accessControl,
  userController.getAll
);

module.exports = router;
