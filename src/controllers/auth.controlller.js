const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// Sign up (admin & user)
exports.signup = async (req, res) => {
  try {
    const { email, password, role, isAdminAllowed } = req.body;

    if (role === "admin" && !isAdminAllowed) {
      // Disallow admin creation via API (can create manually or seed)
      return res
        .status(403)
        .json({ message: "Admin accounts cannot be created via signup." });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: `${role} created successfully`,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sign in
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.googleId) {
      return res.status(400).json({ message: "Please sign in with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Signed in",
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Google login handled by passport (no code needed here)
