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
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const {
  validateUpdateUserInput,
  validateIdParam,
} = require("../middlewares/validationMiddleware");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/current-user").get(authentication, getCurrentUser);
router.route("/block/:id").patch(authentication, validateIdParam, blockUser);
router
  .route("/unblock/:id")
  .patch(authentication, validateIdParam, unblockUser);
router
  .route("/:id")
  .get(validateIdParam, getSingleUser)
  .patch(authentication, validateIdParam, validateUpdateUserInput, updateUser)
  .delete(validateIdParam, deleteUser);

module.exports = router;
