const mongoose = require("mongoose");

const emailAccountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    companyName: { type: String, required: true },
    salaryRange: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isVerified: { type: String, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailAccount", emailAccountSchema);
