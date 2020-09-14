const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const {
  userAccess,
  accessControl,
  rootAccess,
  execAccess,
} = require("../utils/middlewares");

/**
 * POST /place
 * Anyone can place an order except a delivery exec
 */
router.post(
  "/place",
  rootAccess,
  userAccess,
  accessControl,
  orderController.placeOrder
);

/**
 * GET /getAll
 * Root user can fetch all orders
 * User can fetch only orders they placed
 * Delivery Executives can fetch orders they are assigned to
 */
router.get(
  "/getAll",
  rootAccess,
  userAccess,
  execAccess,
  accessControl,
  orderController.getAll
);

/**
 * GET /:id
 * Root user can fetch any order
 * User can fetch any order they placed
 * Delivery Executives can fetch any order they are assigned to
 */
router.get(
  "/:id",
  rootAccess,
  userAccess,
  execAccess,
  accessControl,
  orderController.getOrderById
);

/**
 * PATCH /:id/update
 * To mark the order as delivered or cancelled
 * Root user can update any order
 * Delivery Executives can update orders they are assigned to
 */
router.patch(
  "/:id/update",
  rootAccess,
  execAccess,
  accessControl,
  orderController.updateStatus
);

module.exports = router;
