const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory

const fileFilter = (req, file, cb) => {
  console.log(file, "getting file");
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    console.log("file upload started");
    cb(null, true);
    console.log("file uploaded");
  } else {
    cb(new Error("Only Excel files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
});

module.exports = upload;
