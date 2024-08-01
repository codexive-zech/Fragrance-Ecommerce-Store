const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const { validateIdParam } = require("../middlewares/validationMiddleware");

router
  .route("/")
  .post(authentication, authorization("admin"), createProduct)
  .get(getProducts);
router
  .route("/:id")
  .get(validateIdParam, getSingleProduct)
  .patch(authentication, authorization("admin"), validateIdParam, updateProduct)
  .delete(
    authentication,
    authorization("admin"),
    validateIdParam,
    deleteProduct
  );

module.exports = router;
