const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
    city: { type: String, required: true }        // e.g. "Dhaka"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
