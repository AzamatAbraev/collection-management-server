require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");

const multerUpload = multer({ storage: multer.memoryStorage() });

const storage = new Storage({
  keyFilename: process.env.GCS_KEYFILE_PATH,
  projectId: process.env.GCS_PROJECT_ID,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const uploadImageToGCS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${Date.now()}-${file.originalname}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject("Something is wrong! Unable to upload at the moment." + error);
    });

    blobStream.on("finish", () => {
      const url = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${newFileName}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadImageToGCS };
