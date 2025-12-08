const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    licenseNumber: { type: String },
    company: { type: String } // operator name, e.g. "Shohag Paribahan"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
