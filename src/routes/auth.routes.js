const express = require("express");
const passport = require("passport");
const {
  signup,
  signin,
  createAdminAccount,
} = require("../controllers/auth.controlller");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createadminaccount", createAdminAccount);

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Google OAuth routes
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
