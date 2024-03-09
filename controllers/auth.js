const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

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

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
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

const blockUser = async (req, res) => {
  const { userId } = req.body;
  const userCheck = await User.findById(userId);
  if (userCheck.status === "blocked") {
    throw new BadRequestError("User is already blocked");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { status: "blocked" },
    { new: true },
  );
  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "User blocked successfully" });
};

const unblockUser = async (req, res) => {
  const { userId } = req.body;
  const userCheck = await User.findById(userId);
  if (userCheck.status === "active") {
    throw new BadRequestError("User is already active");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { status: "active" },
    { new: true },
  );
  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "User unblocked successfully" });
};

module.exports = { register, login, blockUser, unblockUser };
