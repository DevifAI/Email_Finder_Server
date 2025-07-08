import express from "express";
import passport from "passport";
import { signup, signin, createAdminAccount, logout } from "../controllers";
import { protect, adminOnly } from "../middlewares";
import generateToken from "../utils";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createadminaccount", protect, adminOnly, createAdminAccount);
router.post("/logout", protect, logout);

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
    res.json({
      message: "Google login success",
      token: generateToken(req.user),
    });
  }
);

export default router;
