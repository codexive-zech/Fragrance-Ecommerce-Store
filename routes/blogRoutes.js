const express = require("express");
const {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadBlogImage,
} = require("../controllers/blogController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const {
  validateIdParam,
  validateBlogInput,
} = require("../middlewares/validationMiddleware");
const {
  uploadImage,
  blogImageResize,
} = require("../middlewares/multerMiddleware");
const router = express.Router();

router
  .route("/")
  .post(authentication, authorization("admin"), validateBlogInput, createBlog)
  .get(getBlogs);

router.route("/likes").patch(authentication, likeBlog);

router.route("/dislikes").patch(authentication, dislikeBlog);
router
  .route("/upload/:id")
  .patch(
    authentication,
    authorization("admin"),
    validateIdParam,
    uploadImage.array("images", 2),
    uploadBlogImage
  );

router
  .route("/:id")
  .get(validateIdParam, getSingleBlog)
  .patch(authentication, authorization("admin"), validateIdParam, updateBlog)
  .delete(authentication, authorization("admin"), validateIdParam, deleteBlog);

module.exports = router;
