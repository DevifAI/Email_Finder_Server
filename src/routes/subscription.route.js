import express from "express";
import { protect } from "../middlewares";
import { subscribeToPlan } from "../controllers";

const router = express.Router();

// USER: subscribe to a plan
router.post("/subscribe", protect, subscribeToPlan);

export default router;
