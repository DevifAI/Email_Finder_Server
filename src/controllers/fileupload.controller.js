const EmailAccount = require("../models/emailaccount.model");
const XLSX = require("xlsx");
const path = require("path");

exports.uploadExcel = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can upload files" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check file type
    const ext = path.extname(req.file.originalname);
    if (ext !== ".xlsx" && ext !== ".xls") {
      return res.status(400).json({ message: "Only Excel files are allowed" });
    }

    // Parse file
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const row of sheet) {
      const { name, email, companyName, salaryRange, address, phoneNumber } =
        row;

      if (!email) continue; // Skip rows without email

      const exists = await EmailAccount.findOne({ email });
      if (exists) {
        skippedCount++;
        continue;
      }

      await EmailAccount.create({
        name,
        email,
        companyName,
        salaryRange,
        address,
        phoneNumber,
      });

      insertedCount++;
    }

    res.json({
      message: "File processed successfully",
      inserted: insertedCount,
      skipped: skippedCount,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Error processing file" });
  }
};
