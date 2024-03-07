const express = require("express");
const router = express.Router();

const {
  register,
  login,
  blockUser,
  unblockUser,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.patch("/block", blockUser);
router.patch("/unblock", unblockUser);

module.exports = router;
