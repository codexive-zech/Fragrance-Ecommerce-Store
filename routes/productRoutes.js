const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addProductToWishlist,
  addRatingsToProduct,
  getProductsInWishlist,
  uploadProductImage,
} = require("../controllers/productController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const {
  validateIdParam,
  validateProductInput,
} = require("../middlewares/validationMiddleware");
const {
  uploadImage,
  productImageResize,
} = require("../middlewares/multerMiddleware");

router
  .route("/")
  .post(
    authentication,
    authorization("admin"),
    validateProductInput,
    createProduct
  )
  .get(getProducts);
router
  .route("/wishlist")
  .patch(authentication, addProductToWishlist)
  .get(authentication, getProductsInWishlist);
router.route("/ratings").patch(authentication, addRatingsToProduct);
router
  .route("/upload/:id")
  .patch(
    authentication,
    authorization("admin"),
    validateIdParam,
    uploadImage.array("images", 10),
    uploadProductImage
  );

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
