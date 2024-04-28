const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const apiRequestLimiter = require("../middleware/rateLimit");

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

const cache = require("../routeCache");

router.get("/", cache(300), getAllCollections);
router.get("/largest", cache(300), getLargestCollections);
router.get("/user", authenticateUser, getCollectionsByUser);
router.get("/:id", getSingleCollection);

router.post("/", authenticateUser, apiRequestLimiter, createCollection);
router.patch("/:id", authenticateUser, updateCollection);
router.delete("/:id", authenticateUser, deleteCollection);
router.delete(
  "/by-collection/:id",
  authenticateUser,
  deleteItemsByCollectionId,
);

module.exports = router;
