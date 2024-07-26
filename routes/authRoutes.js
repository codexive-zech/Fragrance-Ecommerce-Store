const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { authentication } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(authentication, logout);

module.exports = router;
