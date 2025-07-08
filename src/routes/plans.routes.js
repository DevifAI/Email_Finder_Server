import express from "express";
import { protect, adminOnly } from "../middlewares";
import { getPlans, createPlan, updatePlan, deletePlan } from "../controllers";

const router = express.Router();

// USER + ADMIN: View plans (no admin check, just protect)
router.get("/", protect, getPlans);

// ADMIN: Only admin can create, update, or delete plans
router.post("/", protect, adminOnly, createPlan);
router.put("/:id", protect, adminOnly, updatePlan);
router.delete("/:id", protect, adminOnly, deletePlan);

export default router;
