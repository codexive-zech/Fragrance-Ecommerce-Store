const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUser,
  blockUser,
  unblockUser,
  getCurrentUser,
} = require("../controllers/userController");
const { authentication } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/current-user").get(authentication, getCurrentUser);
router.route("/block/:id").patch(blockUser);
router.route("/unblock/:id").patch(unblockUser);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
