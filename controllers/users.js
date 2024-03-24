const User = require("../models/User");
const Collection = require("../models/Collection");
const Item = require("../models/Item");
const { StatusCodes } = require("http-status-codes");

const { BadRequestError, NotFoundError } = require("../errors");

const getAllUsers = async (req, res) => {
  const { query } = req.query;

  let filter = {};

  if (query) {
    filter = {
      $or: [
        { username: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
      ],
    };
  }
  try {
    const users = await User.find(filter).sort("-createdAt");
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
  res.status(StatusCodes.OK).json({ message: "User blocked successfully" });
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const allowedUpdates = ["username", "email", "status", "role"];
    const updates = Object.keys(updateData);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid updates!" });
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(`No user with id ${userId}`);
    }

    updates.forEach((update) => (user[update] = updateData[update]));
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "User updated successfully", user });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
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
  res.status(StatusCodes.OK).json({ message: "User unblocked successfully" });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }

  await Promise.all([
    Collection.deleteMany({ userId: userId }),
    Item.deleteMany({ userId: userId }),
  ]);

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
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
  updateRole,
};
