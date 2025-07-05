const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in days
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
