const express = require("express");
const router = express.Router();
const apiRequestLimiter = require("../middleware/rateLimit");

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

router.get("/", cache(300), getAllItems);
router.post("/", authenticateUser, apiRequestLimiter, createItem);
router.get("/latest", cache(300), getLatestItems);
router.get("/:id", getSingleItem);
router.patch("/:id", authenticateUser, updateItem);
router.delete("/:id", authenticateUser, deleteItem);

router.patch("/:id/like", authenticateUser, likeItem);
router.patch("/:id/unlike", authenticateUser, unlikeItem);

module.exports = router;
