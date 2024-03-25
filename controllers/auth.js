const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: { username: user.username, userId: user._id, role: user.role },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide your email");
  }

  if (!password) {
    throw new BadRequestError("Please provide your password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  if (user.status === "blocked") {
    throw new UnauthenticatedError(
      "You have been blocked. Please contact IT department for more information",
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Incorrect Password");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: { name: user.username, userId: user._id, role: user.role },
    token,
  });
};

const changePassword = async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    throw new BadRequestError("Please provide current password");
  }

  if (!newPassword) {
    throw new BadRequestError("Please provide current password");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthenticatedError("User not found.");
  }

  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Current password is not correct.");
  }

  user.password = newPassword;
  await user.save();

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ message: "Password changed successfully." });
};

module.exports = {
  register,
  login,
  changePassword,
};
