import bcrypt from "bcryptjs";
import { AuthAccount, User } from "../models";
import generateToken, { roles } from "../utils";

// Sign up (user only)
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Check if AuthAccount exists
    let user = await AuthAccount.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "An account with this email already exists. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken({ id: email });

    //  Create AuthAccount
    user = await AuthAccount.create({
      email,
      password: hashedPassword,
      role: roles.USER,
      tokens: [{ token }],
    });

    //  Create linked User profile (only if AuthAccount is new)
    await User.create({
      authId: user._id,
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
export const createAdminAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await AuthAccount.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken({ id: email });

    user = await AuthAccount.create({
      email,
      password: hashedPassword,
      role: roles.ADMIN,
      tokens: [{ token }],
    });

    //  Create linked User profile (only if AuthAccount is new)
    await User.create({
      authId: user._id,
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
export const signin = async (req, res) => {
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

    const token = generateToken({ id: user._id, role: user.role });

    console.log(token, user, "before saving user");

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
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    console.log(req, "req in logout");
    const token = req.user.token;
    const userId = req.user.id;

    if (!token || !userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Remove the current token from tokens array

    const user = User.findById(userId);
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Error logging out" });
  }
};
