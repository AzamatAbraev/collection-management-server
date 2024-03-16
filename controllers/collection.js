const Collection = require("../models/Collection");
const { StatusCodes } = require("http-status-codes");

const createCollection = async (req, res) => {
  const collection = new Collection({
    ...req.body,
    userId: req.user.userId,
  });

  try {
    const savedCollection = await collection.save();
    res.status(StatusCodes.CREATED).json(savedCollection);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getSingleCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id);
    if (collection == null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Collection not found" });
    }
    res.json(collection);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getCollectionsByUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const collections = await Collection.find({ userId: userId });
    res.json(collections);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id);
    if (!collection) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Collection not found" });
    }

    if (
      collection.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Not authorized to update this collection" });
    }

    if (req.body.name != null) {
      collection.name = req.body.name;
    }
    if (req.body.description != null) {
      collection.description = req.body.description;
    }

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Collection not found" });
    }

    if (
      collection.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Not authorized to delete this collection" });
    }

    await collection.remove();
    res.json({ message: "Deleted Collection" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  getCollectionsByUser,
  updateCollection,
  deleteCollection,
  getSingleCollection,
};
