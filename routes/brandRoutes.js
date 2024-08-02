const express = require("express");
const router = express.Router();
const {
  createBrand,
  getBrand,
  getSingleBrand,
  updateSingleBrand,
  deleteSingleBrand,
} = require("../controllers/brandController");
const {
  authentication,
  authorization,
} = require("../middlewares/authMiddleware");
const { validateIdParam } = require("../middlewares/validationMiddleware");

router
  .route("/")
  .get(getBrand)
  .post(authentication, authorization("admin"), createBrand);
router
  .route("/:id")
  .get(authentication, authorization("admin"), validateIdParam, getSingleBrand)
  .patch(
    authentication,
    authorization("admin"),
    validateIdParam,
    updateSingleBrand
  )
  .delete(
    authentication,
    authorization("admin"),
    validateIdParam,
    deleteSingleBrand
  );

module.exports = router;
