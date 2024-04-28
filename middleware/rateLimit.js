const rateLimit = require("express-rate-limit");

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
});

module.exports = apiRequestLimiter;