const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    city: { type: String, default: "" },
    district: { type: String, default: "" },
    upazila: { type: String, default: "" },

    level: {
      type: String,
      enum: ["RED", "YELLOW"],
      default: "RED"
    },

    // link alert to VERIFIED report (optional but recommended)
    sourceReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null
    },

    isActive: { type: Boolean, default: true },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
