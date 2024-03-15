const express = require("express");
const router = express.Router();

const { likeItem, unlikeItem } = require("../controllers/like");
const authenticateUser = require("../middleware/authentication");

router.post("/like/:itemId", authenticateUser, likeItem);

router.delete("/like/:itemId", authenticateUser, unlikeItem);

module.exports = router;
