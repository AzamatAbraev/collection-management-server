const express = require("express");
const router = express.Router();

const {
  addComment,
  getCommentsByItemId,
  deleteComment,
  updateComment,
} = require("../controllers/comment");
const authenticateUser = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");


router.post("/:itemId/comments", authenticateUser, addComment);

router.get("/:itemId/comments", getCommentsByItemId);

router.delete("/comments/:commentId", authenticateUser, deleteComment);
router.patch("/comments/:commentId", authenticateUser, updateComment);

module.exports = router;
