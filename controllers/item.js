const Item = require("../models/Item");
const Collection = require("../models/Collection");
const { StatusCodes } = require("http-status-codes");

const createItem = async (req, res) => {
  if (!req.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication required" });
  }

  const collection = await Collection.findById(req.body.collectionId);

  if (!collection) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Collection not found" });
  }

  if (
    collection.userId.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not authorized to create items in this collection" });
  }

  const itemData = {
    ...req.body,
    userId: req.user.userId,
  };

  const item = new Item(itemData);

  try {
    const savedItem = await item.save();
    res.status(StatusCodes.CREATED).json(savedItem);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getAllItems = async (req, res) => {
  const { collectionId, searchQuery } = req.query;

  try {
    let query = {};
    if (collectionId) {
      query.collectionId = collectionId;
    }

    if (searchQuery) {
      query.$or = [{ name: new RegExp(searchQuery, "i") }];
    }

    const items = await Item.find(query);
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
    item.photo = req.body.photo ?? item.photo;

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

    await item.deleteOne({ _id: req.params.id });
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
