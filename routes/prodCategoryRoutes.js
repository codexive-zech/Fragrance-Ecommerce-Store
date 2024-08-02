const express = require("express");
const router = express.Router();
const {
  getProdCategory,
  createProdCategory,
  getSingleProdCategory,
  updateSingleProdCategory,
  deleteSingleProdCategory,
} = require("../controllers/prodCategoryController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const { validateIdParam } = require("../middlewares/validationMiddleware");

router
  .route("/")
  .get(authentication, authorization("admin"), getProdCategory)
  .post(authentication, authorization("admin"), createProdCategory);
router
  .route("/:id")
  .get(
    authentication,
    authorization("admin"),
    validateIdParam,
    getSingleProdCategory
  )
  .patch(
    authentication,
    authorization("admin"),
    validateIdParam,
    updateSingleProdCategory
  )
  .delete(
    authentication,
    authorization("admin"),
    validateIdParam,
    deleteSingleProdCategory
  );

module.exports = router;
