const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, default: true },
    subscription: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
      subscribedAt: { type: Date },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
