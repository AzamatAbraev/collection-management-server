const express = require("express");
const { uploadImageLocally, multerUpload } = require("../gcs"); // Update this to reflect the change from GCS to local storage
const apiRequestLimiter = require("../middleware/rateLimit");

const router = express.Router();

router.use(apiRequestLimiter);

router.post("/", multerUpload.single("image"), async (req, res) => {
  try {
    const url = await uploadImageLocally(req.file);
    res.send(url);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

module.exports = router;
