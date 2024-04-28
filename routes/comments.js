const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
});

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
