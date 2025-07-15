import mongoose from "mongoose";

const emailAccountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    companyName: { type: String, required: true },
    salaryRange: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isVerified: { type: String, required: true, default: false },
    emailData: { type: Object },
  },
  { timestamps: true }
);

const EmailAccount = mongoose.model("EmailAccount", emailAccountSchema);
export default EmailAccount;
