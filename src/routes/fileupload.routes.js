const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  uploadExcel,
  getUploadStatus,
} = require("../controllers/fileupload.controller");

router.get("/getStatus/:id", protect, adminOnly, getUploadStatus);

router.post(
  "/uploadfile",
  protect,
  adminOnly,
  upload.single("file"),
  uploadExcel
);

module.exports = router;
