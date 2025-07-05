const mongoose = require("mongoose");

const emailAccountSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    companyName: String,
    salaryRange: String,
    address: String,
    phoneNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailAccount", emailAccountSchema);
