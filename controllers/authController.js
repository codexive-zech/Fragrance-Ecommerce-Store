const { StatusCodes } = require("http-status-codes");
const User = require("../model/User");
const { badRequestError, unauthenticatedError } = require("../errors");
const { attachCookiesToResponse } = require("../utils/jwt");
const crypto = require("crypto");
const Token = require("../model/Token");

const validateMongoDBId = require("../utils/validateMongoDBId");

const register = async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new badRequestError("Account Already Created With This Email");
  }
  const user = await User.create(req.body);
  const tokenDetail = {
    userId: user._id,
    role: user.role,
  };
  let refreshToken = "";
  // Creating fresh Token collection
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };
  await Token.create(userToken);
  // End of fresh Token collection creation
  attachCookiesToResponse({ res, user: tokenDetail, refreshToken });
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new badRequestError("Please Provide Email & Password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new unauthenticatedError("Please Provide Valid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new unauthenticatedError(
      "Incorrect Password. Provide Valid Password"
    );
  }
  const tokenDetail = {
    userId: user._id,
    role: user.role,
  };
  let refreshToken = "";
  // Check for existing token
  const existingUserToken = await Token.findOne({ user: tokenDetail.userId });
  if (existingUserToken) {
    const { isValid } = existingUserToken;
    if (!isValid) {
      throw new unauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingUserToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenDetail, refreshToken });
  }
  // End of existing token check
  res.status(StatusCodes.OK).json({ user });
};

const logout = async (req, res) => {
  const { userId } = req.user;
  validateMongoDBId(userId);
  await Token.findOneAndDelete({ user: userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User Logout Successfully" });
};

module.exports = { register, login, logout };
