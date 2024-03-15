const Item = require("../models/Item");
const { StatusCodes } = require("http-status-codes");

const createItem = async (req, res) => {
  const item = new Item({
    ...req.body,
    userId: req.user.userId,
  });

  try {
    const savedItem = await item.save();
    res.status(StatusCodes.CREATED).json(savedItem);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getLatestItems = async (req, res) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 }).limit(8);
    res.status(StatusCodes.OK).json(items);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getSingleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Item not found" });
    }

    if (
      item.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this item" });
    }

    item.name = req.body.name ?? item.name;
    item.tags = req.body.tags ?? item.tags;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Item not found" });
    }

    if (
      item.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Not authorized to delete this item" });
    }

    await item.remove();
    res.json({ message: "Deleted Item" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const searchItems = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide a search query" });
  }

  try {
    const items = await Item.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } },
    ).sort({ score: { $meta: "textScore" } });

    res.status(StatusCodes.OK).json(items);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getLatestItems,
  getSingleItem,
  updateItem,
  deleteItem,
  searchItems,
};
