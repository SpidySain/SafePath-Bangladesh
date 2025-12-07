const express = require("express");
const router = express.Router();

const Vehicle = require("../models/Vehicle");
const Report = require("../models/Report");

const ALLOWED_FIELDS = [
  "model",
  "type",
  "category",
  "registrationNumber",
  "numberPlate",
  "issuingAuthority",
  "issuanceDate",
  "metadata"
];

function pickVehicleUpdates(body = {}) {
  const updates = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }
  return updates;
}

// Fetch a vehicle and its issue history using the QR code value
router.get("/qr/:qrValue", async (req, res) => {
  try {
    const { qrValue } = req.params;
    const vehicle = await Vehicle.findOne({ qrCode: qrValue });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found for this QR" });
    }

    const issueHistory = await Report.find({ vehicle: vehicle._id })
      .populate("issueCategory")
      .populate("location")
      .populate("attachments")
      .sort({ createdAt: -1 });

    return res.json({ vehicle, issueHistory });
  } catch (err) {
    console.error("Error fetching vehicle by QR:", err);
    return res.status(500).json({ message: "Error fetching vehicle", error: err.message });
  }
});

// Update vehicle metadata (used when reporter has permission)
router.patch("/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const updates = pickVehicleUpdates(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No updatable fields provided" });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, updates, {
      new: true
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.json({ message: "Vehicle updated", vehicle });
  } catch (err) {
    console.error("Error updating vehicle:", err);
    return res.status(500).json({ message: "Error updating vehicle", error: err.message });
  }
});

module.exports = router;
