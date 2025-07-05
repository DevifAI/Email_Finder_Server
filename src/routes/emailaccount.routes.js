const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  getAllEmailAccounts,
  getEmailAccount,
  createEmailAccount,
  updateEmailAccount,
  deleteEmailAccount,
} = require("../controllers/emailaccount.controller");

router.get("/", protect, getAllEmailAccounts);
router.get("/:id", protect, getEmailAccount);
router.post("/", protect, adminOnly, createEmailAccount);
router.put("/:id", protect, adminOnly, updateEmailAccount);
router.delete("/:id", protect, adminOnly, deleteEmailAccount);

module.exports = router;
