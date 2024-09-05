const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const { register, login, changePassword } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.patch("/password", authenticateUser, changePassword);

module.exports = router;
