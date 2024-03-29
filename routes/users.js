const express = require("express");
const router = express();

const {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateRole,
  getUserById,
  updateUser,
} = require("../controllers/users");

const isAdmin = require("../middleware/isAdmin");
const authenticateUser = require("../middleware/authentication");

router.get("/", authenticateUser, getAllUsers);
router.get("/:userId", getUserById);
router.patch("/:userId", authenticateUser, updateUser);
router.patch("/:userId/block", authenticateUser, isAdmin, blockUser);
router.patch("/:userId/unblock", authenticateUser, isAdmin, unblockUser);
router.delete("/:userId", authenticateUser, isAdmin, deleteUser);
router.patch("/:userId/role", authenticateUser, isAdmin, updateRole);

module.exports = router;
