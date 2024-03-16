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
} = require("../controllers/collection");

router.get("/", getAllCollections);
router.get("/user", authenticateUser, getCollectionsByUser);
router.get("/:id", getSingleCollection);
router.post("/", authenticateUser, createCollection);
router.patch("/:id", authenticateUser, updateCollection);
router.delete("/:id", authenticateUser, deleteCollection);

module.exports = router;
