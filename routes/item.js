const express = require("express");
const router = express.Router();

const itemController = require("../controllers/item");
const {
  rootAccess,
  userAccess,
  execAccess,
  accessControl,
} = require("../utils/middlewares");

router.post("/create", rootAccess, accessControl, itemController.createItem); //Only root user can add new items
router.get("/getAll", itemController.getAll); //Anyone logged in user can view items
router.get("/:id", itemController.getItemById); //Anyone logged in user can check a particular item

module.exports = router;
