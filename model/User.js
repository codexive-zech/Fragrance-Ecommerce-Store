const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    address: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    passwordCreatedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpire: {
      type: Date,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamp: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isPasswordMatch = await bcrypt.compare(
    candidatePassword,
    this.password
  ); // comparing the hashed password in DB and the added password during Login.
  return isPasswordMatch;
};

userSchema.methods.createResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); // initial Reset Token creating
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); // hashing the created Token
  this.passwordResetExpire = Date.now() + 1000 * 60 * 10; // Reset Token Expires 10 Mins from creation
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
