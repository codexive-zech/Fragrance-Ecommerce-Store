const express = require("express");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const {
  createOrder,
  getProductOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

router
  .route("/")
  .post(authentication, createOrder)
  .get(authentication, getProductOrders);

router
  .route("/:id")
  .patch(authentication, authorization("admin"), updateOrderStatus);

module.exports = router;
