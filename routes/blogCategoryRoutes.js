const express = require("express");
const router = express.Router();
const {
  createBlogCategory,
  getBlogCategory,
  getSingleBlogCategory,
  updateSingleBlogCategory,
  deleteSingleBlogCategory,
} = require("../controllers/blogCategoryController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const { validateIdParam } = require("../middlewares/validationMiddleware");

router
  .route("/")
  .get(authentication, authorization("admin"), getBlogCategory)
  .post(authentication, authorization("admin"), createBlogCategory);
router
  .route("/:id")
  .get(
    authentication,
    authorization("admin"),
    validateIdParam,
    getSingleBlogCategory
  )
  .patch(
    authentication,
    authorization("admin"),
    validateIdParam,
    updateSingleBlogCategory
  )
  .delete(
    authentication,
    authorization("admin"),
    validateIdParam,
    deleteSingleBlogCategory
  );

module.exports = router;
