const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { uploadExcel } = require("../controllers/fileupload.controller");

router.post(
  "/uploadfile",
  protect,
  adminOnly,
  upload.single("file"),
  uploadExcel
);

module.exports = router;
