const mongoose = require("mongoose");

const bulkUploadSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthAccount",
      required: true,
    },
    total: { type: Number, required: true },
    inserted: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    error: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BulkUpload", bulkUploadSchema);
