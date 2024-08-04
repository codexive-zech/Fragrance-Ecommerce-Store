const { StatusCodes } = require("http-status-codes");
const User = require("../model/User");
const { notFoundError } = require("../errors");

const getCurrentUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });
  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new notFoundError("User Does Not Exist");
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) {
    throw new notFoundError("User Does Not Exist");
  }
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    throw new notFoundError("User Does Not Exist");
  }
  res.status(StatusCodes.OK).json({ message: "User Deleted Successfully" });
};

const blockUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { isBlocked: true },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    throw new notFoundError("User Does Not Exist");
  }
  res.status(StatusCodes.OK).json({ message: "User Blocked Successfully" });
};

const unblockUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { isBlocked: false },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    throw new notFoundError("User Does Not Exist");
  }
  res.status(StatusCodes.OK).json({ message: "User Unblocked Successfully" });
};

module.exports = {
  getCurrentUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
};
