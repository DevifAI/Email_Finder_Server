import express from "express";
import { protect, adminOnly } from "../middlewares";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// ADMIN ONLY
router.get("/", adminOnly, getUsers);
router.post("/", adminOnly, createUser);

// USER + ADMIN
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
