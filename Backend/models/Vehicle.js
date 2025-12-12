const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    qrCode: { type: String, required: true, unique: true },
    model: { type: String },
    type: { type: String },
    category: { type: String },
    registrationNumber: { type: String },
    numberPlate: { type: String },
    issuingAuthority: { type: String },
    issuanceDate: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  
    driver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Driver", 
      default: null 
    },

    routeName: { type: String },
    operator: { type: String }
  },
  { timestamps: true }
);

// Unique constraint on `qrCode` is defined on the field itself (unique: true)
// so an explicit schema.index is unnecessary and can cause duplicate index warnings.

module.exports = mongoose.model("Vehicle", vehicleSchema);
