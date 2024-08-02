const { body, param, validationResult } = require("express-validator");
const { badRequestError, unauthorizedError } = require("../errors");
const User = require("../model/User");
const mongoose = require("mongoose");

const withValidationMiddleware = (validationRules) => {
  return [
    validationRules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors
          .array()
          .map((err) => err.msg)
          .join(", ");
        if (errorMessage[0].startsWith("Not Authorized")) {
          throw new unauthorizedError(errorMessage);
        }
        throw new badRequestError(errorMessage);
      }
      next();
    },
  ];
};

const validateRegisterInput = withValidationMiddleware([
  body("firstName").notEmpty().withMessage("Please Provide First Name"),
  body("lastName").notEmpty().withMessage("Please Provide Last Name"),
  body("email")
    .notEmpty()
    .withMessage("Please Provide Email Address")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new badRequestError("Email Already Exist");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Please Provide Password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be 8 Characters Long"),
]);

const validateLoginInput = withValidationMiddleware([
  body("email")
    .notEmpty()
    .withMessage("Please Provide Email")
    .isEmail()
    .withMessage("Please Provide Valid Email Format"),
  body("password")
    .notEmpty()
    .withMessage("Please Provide Password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be 8 Characters Long"),
]);

const validateIdParam = withValidationMiddleware([
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new badRequestError("Invalid MongoDB ID");
    }
    return true;
  }),
]);

const validateProductInput = withValidationMiddleware([
  body("name").notEmpty().withMessage("Please Provide Product Name"),
  body("description")
    .notEmpty()
    .withMessage("Please Provide Product Description"),
  body("price").notEmpty().withMessage("Please Provide Product Price"),
  body("quantity").notEmpty().withMessage("Please Provide Product Quantity"),
  body("category").notEmpty().withMessage("Please Provide Product Category"),
  body("brand").notEmpty().withMessage("Please Provide Product Brand"),
  // body("color").notEmpty().withMessage("Please Provide Product Color"),
]);

const validateBlogInput = withValidationMiddleware([
  body("title").notEmpty().withMessage("Please Provide Blog Title"),
  body("description").notEmpty().withMessage("Please Provide Blog Description"),
  body("category").notEmpty().withMessage("Please Provide Blog Category"),
]);

const validateUpdateUserInput = withValidationMiddleware([
  body("firstName").notEmpty().withMessage("Please Provide First Name"),
  body("lastName").notEmpty().withMessage("Please Provide Last Name"),
  body("email")
    .notEmpty()
    .withMessage("Please Provide Email")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.user.userId) {
        throw new badRequestError("Email Already Exist");
      }
    }), // To distinguish Unique Email
]);

// add validation for other updating part of Model

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateIdParam,
  validateProductInput,
  validateBlogInput,
  validateUpdateUserInput,
};
