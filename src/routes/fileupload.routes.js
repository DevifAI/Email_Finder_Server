import express from "express";
import { protect, adminOnly } from "../middlewares";
import upload from "../middlewares";
import { uploadExcel } from "../controllers";

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

export default router;
