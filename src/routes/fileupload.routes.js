import express from "express";
import { protect, adminOnly } from "../middlewares";
import upload from "../middlewares";
import { uploadExcel } from "../controllers";

const router = express.Router();

router.post(
  "/uploadfile",
  protect,
  adminOnly,
  upload.single("file"),
  uploadExcel
);

export default router;
