const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const { roles } = require("../utils/config");

// Sign up (admin & user)
exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === roles.ADMIN) {
      return res.status(403).json({
        message: "Admin accounts cannot be created via this signup route.",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashedPassword,
      role: role || roles.USER, // default to user if role is not supplied
    });

    res.status(201).json({
      message: `${user.role} created successfully`,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Create admin account (only for initial setup)

exports.createAdminAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashedPassword,
      role: roles.ADMIN,
    });

    res.status(201).json({
      message: "Admin account created successfully",
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === "admin") {
      return res.status(403).json({
        message: "Admin accounts cannot be created via this signup route.",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashedPassword,
      role: role || roles.USER, // default to user if role is not supplied
    });

    res.status(201).json({
      message: `${user.role} created successfully`,
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
