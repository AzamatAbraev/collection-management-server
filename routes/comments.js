const express = require("express");
const router = express.Router();

const { addComment, getCommentsByItemId } = require("../controllers/comment");
const authenticateUser = require("../middleware/authentication");

router.post("/:itemId/comments", authenticateUser, addComment);

router.get("/:itemId/comments", getCommentsByItemId);

module.exports = router;
