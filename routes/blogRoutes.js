const express = require("express");
const {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controllers/blogController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const { validateIdParam } = require("../middlewares/validationMiddleware");
const router = express.Router();

router
  .route("/")
  .post(authentication, authorization("admin"), createBlog)
  .get(getBlogs);

router.route("/likes").patch(authentication, likeBlog);

router.route("/dislikes").patch(authentication, dislikeBlog);

router
  .route("/:id")
  .get(validateIdParam, getSingleBlog)
  .patch(authentication, authorization("admin"), validateIdParam, updateBlog)
  .delete(authentication, authorization("admin"), validateIdParam, deleteBlog);

module.exports = router;
