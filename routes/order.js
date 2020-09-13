const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");

router.post("/place", orderController.placeOrder);
router.get("/getAll", orderController.getAll);
router.get("/:id", orderController.getOrderById);

module.exports = router;