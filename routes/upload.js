const express = require("express");
const multer = require("multer");
const { uploadImageToGCS } = require("../gcs");

const rateLimit = require("express-rate-limit");

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
});

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(apiRequestLimiter);

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const url = await uploadImageToGCS(req.file);
    res.send(url);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

module.exports = router;
