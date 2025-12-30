const mongoose = require("mongoose");

const AwarenessSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    description: { type: String, default: "" },
    
    // categorize awareness messages
    category: {
      type: String,
      enum: ["SAFETY", "TIPS", "EDUCATION", "ANNOUNCEMENT"],
      default: "SAFETY"
    },

    // priority level
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    // display control
    isActive: { type: Boolean, default: true },
    
    // optional: set expiration date for awareness message
    expiresAt: { type: Date, default: null },

    // created by admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Awareness", AwarenessSchema);
