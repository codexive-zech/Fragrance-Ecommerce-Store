const { unauthenticatedError } = require("../errors");
const Token = require("../model/Token");
const { verifyToken, attachCookiesToResponse } = require("../utils/jwt");

const authentication = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = verifyToken(accessToken);
      req.user = {
        userId: payload.userId,
        role: payload.role,
      };
      return next();
    }
    const payload = verifyToken(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new unauthenticatedError("Authentication Invalid");
    }
    attachCookiesToResponse({
      res,
      refreshToken: existingToken.refreshToken,
      user: payload.user,
    });
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    return next();
  } catch (error) {
    throw new unauthenticatedError("Authentication Invalid");
  }
};

module.exports = { authentication };
