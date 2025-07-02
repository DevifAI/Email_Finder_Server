const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
