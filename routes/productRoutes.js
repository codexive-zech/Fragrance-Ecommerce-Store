const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addProductToWishlist,
} = require("../controllers/productController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const {
  validateIdParam,
  validateProductInput,
} = require("../middlewares/validationMiddleware");

router
  .route("/")
  .post(
    authentication,
    authorization("admin"),
    validateProductInput,
    createProduct
  )
  .get(getProducts);
router.route("/wishlist").patch(authentication, addProductToWishlist);
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
