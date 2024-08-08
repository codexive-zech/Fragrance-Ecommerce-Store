const multer = require("multer");
const DataURIASync = require("datauri/parser.js");
const path = require("path");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, this);
  } else {
    cb({ message: "Unsupported File Format" }, false);
  }
};

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

const parser = new DataURIASync();
const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

const formatImages = (files) => {
  return files.map((file) => formatImage(file));
};

module.exports = { uploadImage, formatImages };
