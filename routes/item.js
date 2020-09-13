const express = require("express");
const router = express.Router();

const itemController = require("../controllers/item");

router.post("/create", itemController.createItem);
router.get("/getAll", itemController.getAll);
router.get("/:id", itemController.getItemById);

module.exports = router;
