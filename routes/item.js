const express = require("express");
const router = express.Router();

const itemController = require("../controllers/item");
const {
  rootAccess,
  userAccess,
  execAccess,
  accessControl,
} = require("../utils/middlewares");

/**
 * POST /create
 * Root user can create an item for the shop
 */
router.post("/create", rootAccess, accessControl, itemController.createItem);

/**
 * GET /getAll
 * Any logged in user can view items
 */
router.get("/getAll", itemController.getAll);

/**
 * GET /:id
 * Any logged in user can check a particular item
 */
router.get("/:id", itemController.getItemById);

module.exports = router;
