const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporterId: { type: String, required: true },

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: false   
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true
  },
  issueCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IssueCategory",
    required: true
  },
  severity: { type: Number, min: 1, max: 5, default: 3 },
  description: { type: String },

  // NEW FIELD:
  attachments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "MediaAttachment" }
  ],

  status: {
    type: String,
    enum: ["PENDING", "VERIFIED", "FALSE"],
    default: "PENDING"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);
