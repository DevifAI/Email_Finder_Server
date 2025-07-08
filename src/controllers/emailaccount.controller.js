import EmailAccount from "../model";

// GET all with filters + pagination + sorting
export const getAllEmailAccounts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      email,
      companyName,
      name,
    } = req.query;
    const query = {};

    if (email) query.email = new RegExp(email, "i");
    if (companyName) query.companyName = new RegExp(companyName, "i");
    if (name) query.name = new RegExp(name, "i");

    const emailAccounts = await EmailAccount.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await EmailAccount.countDocuments(query);

    res.json({
      data: emailAccounts,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

// GET single
export const getEmailAccount = async (req, res) => {
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
export const createEmailAccount = async (req, res) => {
  try {
    const { name, email, companyName, salaryRange, address, phoneNumber } =
      req.body;

    if (await EmailAccount.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const account = await EmailAccount.create({
      name,
      email,
      companyName,
      salaryRange,
      address,
      phoneNumber,
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: "Error creating record" });
  }
};

// PUT update
export const updateEmailAccount = async (req, res) => {
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
export const deleteEmailAccount = async (req, res) => {
  try {
    const result = await EmailAccount.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting record" });
  }
};
