const express = require("express");
const router = express();

const {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateRole,
  getUserById,
} = require("../controllers/users");

const isAdmin = require("../middleware/isAdmin");
const authenticateUser = require("../middleware/authentication");

router.use(authenticateUser);

router.get("/", isAdmin, getAllUsers);
router.get("/:userId", isAdmin, getUserById);
router.patch("/:userId/block", isAdmin, blockUser);
router.patch("/:userId/unblock", isAdmin, unblockUser);
router.delete("/:userId", isAdmin, deleteUser);
router.patch("/:userId/role", isAdmin, updateRole);

module.exports = router;
