const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const {
  createCollection,
  getAllCollections,
  updateCollection,
  deleteCollection,
  getSingleCollection,
  getCollectionsByUser,
  deleteItemsByCollectionId,
  getLargestCollections,
} = require("../controllers/collection");

router.get("/", getAllCollections);
router.get("/largest", getLargestCollections);
router.get("/user", authenticateUser, getCollectionsByUser);
router.get("/:id", getSingleCollection);
router.post("/", authenticateUser, createCollection);
router.patch("/:id", authenticateUser, updateCollection);
router.delete("/:id", authenticateUser, deleteCollection);
router.delete(
  "/by-collection/:id",
  authenticateUser,
  deleteItemsByCollectionId,
);

module.exports = router;
