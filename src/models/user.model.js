import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthAccount",
      required: true,
    },
    email: { type: String, required: true, unique: true },

    role: { type: String, enum: ["admin", "user"], default: "user" },

    subscription: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
      subscribedAt: { type: Date },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
