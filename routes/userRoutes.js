const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUser,
  blockUser,
  unblockUser,
} = require("../controllers/userController");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/block/:id").patch(blockUser);
router.route("/unblock/:id").patch(unblockUser);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
