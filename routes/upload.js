const express = require("express");
const multer = require("multer");
const { uploadImageToGCS } = require("../gcs");
const apiRequestLimiter = require("../middleware/rateLimit");

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
