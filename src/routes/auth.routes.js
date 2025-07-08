const express = require("express");
const passport = require("passport");
const {
  signup,
  signin,
  createAdminAccount,
  logout,
} = require("../controllers/auth.controlller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createadminaccount", protect, adminOnly, createAdminAccount);

router.post("/logout", protect, logout);

// Google OAuth routes yty
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Send token
    res.json({
      message: "Google login success",
      token: require("../utils/generateToken")(req.user),
    });
  }
);

module.exports = router;
