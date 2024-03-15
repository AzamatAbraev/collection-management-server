const { StatusCodes } = require("http-status-codes");

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Access denied. Admins only." });
  }
};

module.exports = isAdmin;
