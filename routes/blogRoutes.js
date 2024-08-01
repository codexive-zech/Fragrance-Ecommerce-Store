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
const router = express.Router();

router
  .route("/")
  .post(authentication, authorization("admin"), createBlog)
  .get(getBlogs);

router.route("/likes").patch(authentication, likeBlog);

router.route("/dislikes").patch(authentication, dislikeBlog);

router
  .route("/:id")
  .get(getSingleBlog)
  .patch(authentication, authorization("admin"), updateBlog)
  .delete(authentication, authorization("admin"), deleteBlog);

module.exports = router;
