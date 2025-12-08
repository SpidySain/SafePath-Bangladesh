const express = require("express");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ADMIN: Create a vehicle
 */
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const {
      qrCode,
      model,
      type,
      category,
      registrationNumber,
      numberPlate,
      issuingAuthority,
      issuanceDate,
      metadata,
      driverId,
      routeName,
      operator
    } = req.body;

    const vehicle = await Vehicle.create({
      qrCode,
      model,
      type,
      category,
      registrationNumber,
      numberPlate,
      issuingAuthority,
      issuanceDate,
      metadata,
      driver: driverId || null,
      routeName,
      operator
    });

    res.status(201).json(vehicle);
  } catch (err) {
    console.error("Vehicle creation error:", err);
    res.status(500).json({ message: "Error creating vehicle", error: err.message });
  }
});

/**
 * PUBLIC: Get vehicle info via QR
 * (important for rating system)
 */
router.get("/from-qr/:qrData", async (req, res) => {
  try {
    const { qrData } = req.params;

    const vehicle = await Vehicle.findOne({ qrCode: qrData }).populate("driver");

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found for this QR" });
    }

    res.json(vehicle);
  } catch (err) {
    console.error("QR lookup error:", err);
    res.status(500).json({ message: "Error fetching vehicle", error: err.message });
  }
});

/**
 * PUBLIC: List vehicles (optionally filter by route)
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.routeName) filter.routeName = req.query.routeName;

    const vehicles = await Vehicle.find(filter).populate("driver");
    res.json(vehicles);
  } catch (err) {
    console.error("List vehicles error:", err);
    res.status(500).json({ message: "Error fetching vehicles", error: err.message });
  }
});

module.exports = router;
