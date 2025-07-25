const User = require("../models/user.model");
const { roles } = require("../utils/config");

// Admin  : Get all users
exports.getUsers = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default 10 users per page
    const skip = (page - 1) * limit;

    // Filters
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role; // e.g. role=admin
    }
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" }; // case-insensitive match
    }

    // Sorting
    const sort = { createdAt: -1 }; // newest first

    // Query DB
    const users = await User.find(filter)
      .select("-password -__v")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const total = await User.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Admin + user : Get user by ID
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};
// Admin: Create user
exports.createUser = async (req, res) => {
  try {
    const { email, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await User.create({
      email,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin + User : Update user
exports.updateUser = async (req, res) => {
  if (req.user.role === roles.USER && req.body.isActive) {
    return res
      .status(401)
      .json({ message: "User cannot deactivate or activate user or admin" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({
    message: "User updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive,
    },
  });
};

// Admin + User : Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};
