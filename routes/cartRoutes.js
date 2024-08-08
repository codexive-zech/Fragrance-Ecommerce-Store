const express = require("express");
const router = express.Router();
const { authentication } = require("../middlewares/authMiddleware");
const {
  addProductToCart,
  getAllProductsCart,
  emptyCart,
  applyCoupon,
} = require("../controllers/cartController");

router
  .route("/")
  .get(authentication, getAllProductsCart)
  .post(authentication, addProductToCart);
router.route("/empty-cart").delete(authentication, emptyCart);
router.route("/apply-coupon").post(authentication, applyCoupon);

module.exports = router;
