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
  likeItem,
  unlikeItem,
} = require("../controllers/item");

const cache = require("../routeCache");

router.get("/search", searchItems);

router.get("/", getAllItems);
router.post("/", authenticateUser, createItem);
router.get("/latest", getLatestItems);
router.get("/:id", getSingleItem);
router.patch("/:id", authenticateUser, updateItem);
router.delete("/:id", authenticateUser, deleteItem);

router.patch("/:id/like", authenticateUser, likeItem);
router.patch("/:id/unlike", authenticateUser, unlikeItem);

module.exports = router;
