const bcrypt = require("bcryptjs");
const AuthAccount = require("../models/auth.model");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const { roles } = require("../utils/config");

// Sign up (user only)
exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === roles.ADMIN) {
      return res.status(403).json({
        message: "Admin accounts cannot be created via this signup route.",
      });
    }

    //  Check if AuthAccount exists
    let user = await AuthAccount.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "An account with this email already exists. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create AuthAccount
    user = await AuthAccount.create({
      email,
      password: hashedPassword,
      role: roles.USER,
    });
    // we need to create the token after the a
    const token = generateToken({ id: user._id, role: roles.USER });
    user = await AuthAccount.findByIdAndUpdate(user._id, {
      tokens: [{ token }],
    });

    //  Create linked User profile (only if AuthAccount is new)
    await User.create({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "User account + profile created successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create admin account
exports.createAdminAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await AuthAccount.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await AuthAccount.create({
      email,
      password: hashedPassword,
      role: roles.ADMIN,
    });

    const token = generateToken({ id: user._id, role: roles.USER });
    user = await AuthAccount.findByIdAndUpdate(user._id, {
      tokens: [{ token }],
    });

    //  Create linked User profile (only if AuthAccount is new)
    await User.create({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "Admin account created successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sign in
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthAccount.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.googleId) {
      return res.status(400).json({ message: "Please sign in with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate new token
    const userData = await User.findById(user._id);
    const token = generateToken({ id: user._id, role: user.role });

    // Save token to DB (optional, if you want to track sessions)
    user.tokens.push({ token });
    await user.save();

    // Create session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Signed in",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Get token from header or session
    const token =
      req.headers.authorization?.replace("Bearer ", "") || req.session?.token;
    const userId = req.session?.user?.id || req.user?.id;

    if (!token || !userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Remove the current token from tokens array
    const user = await AuthAccount.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();

    // Destroy session
    if (req.session) {
      req.session.destroy(() => {});
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Error logging out" });
  }
};
