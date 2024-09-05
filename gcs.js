const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "./uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const multerUpload = multer({ storage });

const uploadImageLocally = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    const fileUrl = `${
      process.env.BASE_URL || "http://localhost:3000"
    }/uploads/${file.filename}`;
    resolve(fileUrl);
  });
};

module.exports = { uploadImageLocally, multerUpload };
