const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const { BadRequestError, NotFoundError } = require("../errors");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  const { userId } = req.params;
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
  const { userId } = req.params;
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

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }
  res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
};

const updateRole = async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true },
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: `User role updated to ${newRole}`, user });
};

module.exports = {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  updateRole,
};
