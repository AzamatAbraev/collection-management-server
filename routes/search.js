const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const Collection = require("../models/Collection");
const Item = require("../models/Item");

router.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide a search query" });
  }

  const searchPattern = new RegExp(query, "i");

  try {
    const items = await Item.find({
      $or: [
        { name: { $regex: searchPattern } },
        { tags: { $regex: searchPattern } },
      ],
    });
    const collections = await Collection.find({
      $or: [
        { name: { $regex: searchPattern } },
        { description: { $regex: searchPattern } },
      ],
    });

    const results = [...items, ...collections];

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
});

module.exports = router;
