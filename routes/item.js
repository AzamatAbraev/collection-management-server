const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const {
  createItem,
  getAllItems,
  getSingleItem,
  updateItem,
  deleteItem,
  searchItems,
  getLatestItems,
} = require("../controllers/item");

router.get("/search", searchItems);

router.get("/", getAllItems);
router.post("/", authenticateUser, createItem);
router.get("/latest", getLatestItems);
router.get("/:id", getSingleItem);
router.patch("/:id", authenticateUser, updateItem);
router.delete("/:id", authenticateUser, deleteItem);

module.exports = router;
