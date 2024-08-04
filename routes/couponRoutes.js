const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getAllCoupon,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const { validateIdParam } = require("../middlewares/validationMiddleware");

router
  .route("/")
  .post(authentication, authorization("admin"), createCoupon)
  .get(authentication, authorization("admin"), getAllCoupon);
router
  .route("/:id")
  .get(authentication, authorization("admin"), validateIdParam, getSingleCoupon)
  .patch(authentication, authorization("admin"), validateIdParam, updateCoupon)
  .delete(
    authentication,
    authorization("admin"),
    validateIdParam,
    deleteCoupon
  );

module.exports = router;
