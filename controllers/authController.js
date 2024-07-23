const { StatusCodes } = require("http-status-codes");
const User = require("../model/User");
const { badRequestError, unauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new badRequestError("Account Already Created With This Email");
  }
  const user = await User.create(req.body);
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
  res.status(StatusCodes.OK).json({ user });
};

module.exports = { register, login };
