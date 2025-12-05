const express = require("express");
const router = express.Router();

const Report = require("../models/Report");
const Location = require("../models/Location");
const IssueCategory = require("../models/IssueCategory");
const MediaAttachment = require("../models/MediaAttachment");

/**
 * -----------------------------------------------------
 * POST /api/reports
 * Create a new report
 * -----------------------------------------------------
 */
router.post("/", async (req, res) => {
  try {
    const {
      reporterId,
      latitude,
      longitude,
      address,
      city,
      issueCategoryId,
      severity,
      description,
      attachmentIds      // array of MediaAttachment _id
    } = req.body;

    // Validate required fields
    if (!reporterId || !latitude || !longitude || !city || !issueCategoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1) Create Location document
    const location = await Location.create({
      latitude,
      longitude,
      address,
      city
    });

    // 2) Check if Issue Category exists
    const category = await IssueCategory.findById(issueCategoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid issueCategoryId" });
    }

    // 3) Create report with optional attachments
    const report = await Report.create({
      reporterId,
      location: location._id,
      issueCategory: issueCategoryId,
      severity,
      description,
      attachments: attachmentIds || []
    });

    return res.status(201).json({
      message: "Report created successfully",
      report
    });

  } catch (err) {
    console.error("Error creating report:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


/**
 * -----------------------------------------------------
 * GET /api/reports
 * Fetch all reports (for map display)
 * -----------------------------------------------------
 */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("location")
      .populate("issueCategory")
      .populate("attachments");

    return res.json(reports);

  } catch (err) {
    console.error("Error fetching reports:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


/**
 * -----------------------------------------------------
 * GET /api/reports/user/:userId
 * Fetch all reports created by one user
 * -----------------------------------------------------
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const reports = await Report.find({ reporterId: userId })
      .populate("location")
      .populate("issueCategory")
      .populate("attachments");

    return res.json(reports);

  } catch (err) {
    console.error("Error fetching user reports:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


/**
 * -----------------------------------------------------
 * GET /api/reports/from-qr/:qrValue
 * Helper endpoint for QR pre-fill
 * Example QR: "Dhaka|Banani Bus Stop|23.794|90.414"
 * -----------------------------------------------------
 */
router.get("/from-qr/:qrValue", async (req, res) => {
  try {
    const { qrValue } = req.params;

    const parts = qrValue.split("|");
    if (parts.length !== 4) {
      return res.status(400).json({ message: "Invalid QR format" });
    }

    const [city, address, latStr, lngStr] = parts;
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lngStr);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: "Invalid coordinates in QR" });
    }

    return res.json({
      city,
      address,
      latitude,
      longitude
    });

  } catch (err) {
    console.error("QR parse error:", err);
    return res.status(500).json({ message: "Error parsing QR value", error: err.message });
  }
});

module.exports = router;
