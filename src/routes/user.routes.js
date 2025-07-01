const express = require("express");
const passport = require("passport");
const { signup, signin } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

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
