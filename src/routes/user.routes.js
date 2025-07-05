const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.use(protect);

// only admin can access this route

router.get("/", adminOnly, getUsers);
// rest of this routes can be accessible by the user as well
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
