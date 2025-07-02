const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String }, // only for Google users
    role: { type: String, enum: ["admin", "user"], default: "user" },
    subscription: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
      subscribedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
