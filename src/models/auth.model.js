import mongoose from "mongoose";

const authAccountSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // hashed password
    role: { type: String, enum: ["admin", "user"], default: "user" },

    googleId: { type: String }, // if using Google login
    tokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const AuthAccount = mongoose.model("AuthAccount", authAccountSchema);
export default AuthAccount;
