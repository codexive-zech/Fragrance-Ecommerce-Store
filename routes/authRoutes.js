const express = require("express");
const {
  register,
  login,
  logout,
  changePassword,
} = require("../controllers/authController");
const { authentication } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(authentication, logout);
router.route("/password").patch(authentication, changePassword);

module.exports = router;
