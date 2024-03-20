const express = require("express");
const router = express.Router();

const {
  addComment,
  getCommentsByItemId,
  getAllComments,
} = require("../controllers/comment");
const authenticateUser = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

router.get("/comments", authenticateUser, isAdmin, getAllComments);

router.post("/:itemId/comments", authenticateUser, addComment);

router.get("/:itemId/comments", getCommentsByItemId);

module.exports = router;
