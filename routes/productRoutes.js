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

router
  .route("/")
  .post(authentication, authorization("admin"), createProduct)
  .get(getProducts);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authentication, authorization("admin"), updateProduct)
  .delete(authentication, authorization("admin"), deleteProduct);

module.exports = router;
