const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const {
  userAccess,
  accessControl,
  rootAccess,
  execAccess,
} = require("../utils/middlewares");

router.post(
  "/place",
  rootAccess,
  userAccess,
  accessControl,
  orderController.placeOrder
);
router.get(
  "/getAll",
  rootAccess,
  userAccess,
  execAccess,
  accessControl,
  orderController.getAll
);
router.get(
  "/:id",
  rootAccess,
  userAccess,
  execAccess,
  accessControl,
  orderController.getOrderById
);
router.patch(
  "/:id/update",
  rootAccess,
  execAccess,
  accessControl,
  orderController.updateStatus
);

module.exports = router;
