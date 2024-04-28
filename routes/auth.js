const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const rateLimit = require("express-rate-limit");

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
});

router.use(apiRequestLimiter);

const { register, login, changePassword } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.patch("/password", authenticateUser, changePassword);

module.exports = router;
