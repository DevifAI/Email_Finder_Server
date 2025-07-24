const agenda = require("../jobs/agenda");
const EmailAccount = require("../models/emailaccount.model");
const User = require("../models/user.model");
const { roles } = require("../utils/config");

// GET all with filters + pagination + sorting
exports.getAllEmailAccounts = async (req, res) => {
  if (req.user.role === roles.USER) {
    const user = await User.findById(req.user.id);
    if (user.subscription.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Subscribe to get data" });
    }
  }
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      email,
      companyname,
      name,
      isverified,
    } = req.query;
    const query = {};

    if (email) query.email = new RegExp(email, "i");
    if (companyname) query.companyname = new RegExp(companyname, "i");
    if (name) query.name = new RegExp(name, "i");
    if (isverified) query.isverified = true;

    const emailAccounts = await EmailAccount.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await EmailAccount.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    res.json({
      data: emailAccounts,
      total: count,
      page: parseInt(page),
      totalPages,
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

// GET single
exports.getEmailAccount = async (req, res) => {
  try {
    const account = await EmailAccount.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Record not found" });

    res
      .status(200)
      .json({ account, message: "Emailaccount details fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error fetching record" });
  }
};

// POST create
exports.createEmailAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (await EmailAccount.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    agenda.now("verify_and_save_email", { row: req.body });

    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: "Error creating record" });
  }
};

// PUT update
exports.updateEmailAccount = async (req, res) => {
  try {
    const account = await EmailAccount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!account) return res.status(404).json({ message: "Record not found" });

    res
      .status(200)
      .json({ account, message: "Email account updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating record" });
  }
};

// DELETE
exports.deleteEmailAccount = async (req, res) => {
  try {
    const result = await EmailAccount.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting record" });
  }
};
