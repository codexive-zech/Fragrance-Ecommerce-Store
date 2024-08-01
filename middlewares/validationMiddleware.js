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
          throw new UnauthorizedError(errorMessage);
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
  (req, res, next) => {
    if (req.user.role !== "admin") {
      throw new unauthorizedError("Not Authorized To Access This Route");
    }
    next();
  },
]);

module.exports = { validateRegisterInput, validateLoginInput, validateIdParam };
