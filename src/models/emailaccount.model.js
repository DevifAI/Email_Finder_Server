const mongoose = require("mongoose");

const emailAccountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    companyName: { type: String, required: true },
    position: { type: String, required: true },
    company: { type: String, required: true },
    website: { type: String, required: true },
    linkedIn: { type: String, required: true },
    isVerified: { type: String, required: true, default: false },
    emailData: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailAccount", emailAccountSchema);
