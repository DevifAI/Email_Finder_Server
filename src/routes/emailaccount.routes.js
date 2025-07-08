import express from "express";
import { protect, adminOnly } from "../middlewares";
import {
  getAllEmailAccounts,
  getEmailAccount,
  createEmailAccount,
  updateEmailAccount,
  deleteEmailAccount,
} from "../controllers";

const router = express.Router();

router.get("/", protect, getAllEmailAccounts);
router.get("/:id", protect, getEmailAccount);
router.post("/", protect, adminOnly, createEmailAccount);
router.put("/:id", protect, adminOnly, updateEmailAccount);
router.delete("/:id", protect, adminOnly, deleteEmailAccount);

export default router;
