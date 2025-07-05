const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/plans.controller");

const router = express.Router();

// USER + ADMIN: View plans (no admin check, just protect)
router.get("/", protect, getPlans);

// ADMIN: write operations
// Only admin can create, update, or delete plans
router.post("/", protect, adminOnly, createPlan);
router.put("/:id", protect, adminOnly, updatePlan);
router.delete("/:id", protect, adminOnly, deletePlan);

module.exports = router;
