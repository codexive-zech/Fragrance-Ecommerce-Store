const express = require("express");
const {
  register,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { authentication } = require("../middlewares/authMiddleware");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../middlewares/validationMiddleware");
const router = express.Router();

router.route("/register").post(validateRegisterInput, register);
router.route("/login").post(validateLoginInput, login);
router.route("/logout").get(authentication, logout);
router.route("/password").patch(authentication, changePassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").patch(resetPassword);

module.exports = router;
