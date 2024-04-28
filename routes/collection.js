const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const rateLimit = require("express-rate-limit");

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
});


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

router.use(apiRequestLimiter);
router.post("/", authenticateUser, createCollection);
router.patch("/:id", authenticateUser, updateCollection);
router.delete("/:id", authenticateUser, deleteCollection);
router.delete(
  "/by-collection/:id",
  authenticateUser,
  deleteItemsByCollectionId,
);

module.exports = router;
