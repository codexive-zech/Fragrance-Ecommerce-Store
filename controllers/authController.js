const { StatusCodes } = require("http-status-codes");
const User = require("../model/User");
const { badRequestError, unauthenticatedError } = require("../errors");
const { attachCookiesToResponse } = require("../utils/jwt");
const crypto = require("crypto");
const Token = require("../model/Token");
const createTokenUser = require("../utils/createTokenUser");

const register = async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new badRequestError("Account Already Created With This Email");
  }
  const user = await User.create(req.body);
  const tokenUser = createTokenUser(user);
  let refreshToken = "";
  // Creating fresh Token collection
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };
  await Token.create(userToken);
  // End of fresh Token collection creation
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
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

module.exports = { register, login };
