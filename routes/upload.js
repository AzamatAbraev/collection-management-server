const express = require("express");
const { uploadImageLocally, multerUpload } = require("../gcs");

const router = express.Router();

router.post("/", multerUpload.single("image"), async (req, res) => {
  try {
    const url = await uploadImageLocally(req.file);
    res.send(url);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

module.exports = router;
