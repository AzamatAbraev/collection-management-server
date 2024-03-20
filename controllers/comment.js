const Comment = require("../models/Comment");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  const { itemId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const comment = await Comment.create({
      content,
      itemId,
      userId,
    });
    res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getCommentsByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;

    const comments = await Comment.find({ itemId }).populate(
      "userId",
      "username",
    );

    res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByItemId,
  getAllComments,
};
