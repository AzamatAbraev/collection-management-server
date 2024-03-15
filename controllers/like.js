const Like = require("../models/Like");
const { StatusCodes } = require("http-status-codes");

const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.userId;

  try {
    const like = await Like.create({ itemId, userId });
    res.status(StatusCodes.CREATED).json(like);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "You've already liked this item" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
};

const unlikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.userId;

  const like = await Like.findOneAndDelete({ itemId, userId });

  if (!like) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Like not found" });
  }

  res.status(StatusCodes.OK).json({ message: "Like removed" });
};

module.exports = {
  likeItem,
  unlikeItem,
};
