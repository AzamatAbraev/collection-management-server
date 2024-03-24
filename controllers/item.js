const Item = require("../models/Item");
const Collection = require("../models/Collection");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { validateCustomFields } = require("../middleware/validateCustomValues");

const createItem = async (req, res) => {
  const { collectionId, name, tags, customValues } = req.body;

  if (!req.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication required" });
  }

  const collection = await Collection.findById(collectionId);

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

  const validationErrors = [];
  if (
    !validateCustomFields(
      customValues,
      collection.customFields,
      validationErrors,
    )
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Validation error", errors: validationErrors });
  }

  const itemData = {
    name,
    tags,
    collectionId,
    customValues,
    userId: req.user.userId,
  };

  const item = new Item(itemData);

  try {
    const savedItem = await item.save();
    await Collection.findByIdAndUpdate(req.body.collectionId, {
      $inc: { itemCount: 1 },
    });

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

    const items = await Item.find(query)
      .populate("userId", "username")
      .populate("collectionId", "name");
    res.json(items);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getLatestItems = async (req, res) => {
  try {
    const items = await Item.find({})
      .populate("userId", "username")
      .populate("collectionId", "name")
      .sort({ createdAt: -1 })
      .limit(8);
    res.status(StatusCodes.OK).json(items);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getSingleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "likes",
      "username",
    );
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
    await Collection.findByIdAndUpdate(item.collectionId, {
      $inc: { itemCount: -1 },
    });

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

const likeItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const alreadyLiked = item.likes.includes(req.user.userId);
    if (!alreadyLiked) {
      item.likes.push(req.user.userId);
      await item.save();
      return res.status(200).json({ message: "Liked the item" });
    }

    res.status(400).json({ message: "Item already liked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unlikeItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.likes = item.likes.filter(
      (userId) => userId.toString() !== req.user.userId,
    );
    await item.save();
    res.status(200).json({ message: "Unliked the item" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  likeItem,
  unlikeItem,
};
