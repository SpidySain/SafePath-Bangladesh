const express = require("express");
const router = express.Router();

const Report = require("../models/Report");
const Location = require("../models/Location");
const IssueCategory = require("../models/IssueCategory");
const MediaAttachment = require("../models/MediaAttachment");
const Vehicle = require("../models/Vehicle");

const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const ALLOWED_VEHICLE_FIELDS = [
  "model",
  "type",
  "category",
  "registrationNumber",
  "numberPlate",
  "issuingAuthority",
  "issuanceDate",
  "metadata"
];

/**
 * -----------------------------------------------------
 * POST /api/reports
 * Create a new report
 * - Vehicle is OPTIONAL (Req 1: location-only, Req 4: vehicle-linked)
 * -----------------------------------------------------
 */
router.post("/", async (req, res) => {
  try {
    const {
      reporterId,
      vehicleId,
      latitude,
      longitude,
      address,
      city,
      district,  
      upazila, 
      issueCategoryId,
      severity,
      description,
      attachmentIds,      // array of MediaAttachment _id
      vehicleUpdates,     // optional partial updates for the vehicle
      allowVehicleEdit
    } = req.body;

    // Validate required fields (vehicle is NOT required)
    if (!reporterId || !latitude || !longitude || !city || !issueCategoryId) {
      return res.status(400).json({
        message: "Missing required fields (reporter, location, issue type)"
      });
    }

    // 1) Create Location document
    const location = await Location.create({
      latitude,
      longitude,
      address,
      city,
      district: district || "",
      upazila: upazila || ""
    });

    // 2) Check if Issue Category exists
    const category = await IssueCategory.findById(issueCategoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid issueCategoryId" });
    }

    // 3) OPTIONAL vehicle block (only run if vehicleId is provided)
    let updatedVehicle = null;

    if (vehicleId) {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(400).json({ message: "Invalid vehicleId" });
      }

      updatedVehicle = vehicle;

      // Optional vehicle updates when explicitly allowed
      if (allowVehicleEdit && vehicleUpdates && typeof vehicleUpdates === "object") {
        const updatePayload = {};
        ALLOWED_VEHICLE_FIELDS.forEach(field => {
          if (vehicleUpdates[field] !== undefined) {
            updatePayload[field] = vehicleUpdates[field];
          }
        });

        if (Object.keys(updatePayload).length > 0) {
          updatedVehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            updatePayload,
            { new: true }
          );
        }
      }
    }

    // 4) Build report payload with optional vehicle
    const reportData = {
      reporterId,
      location: location._id,
      issueCategory: issueCategoryId,
      severity: typeof severity === "number" ? severity : 3,
      description,
      attachments: attachmentIds || []
    };

    if (vehicleId) {
      reportData.vehicle = vehicleId;
    }

    // 5) Create report
    const report = await Report.create(reportData);

    return res.status(201).json({
      message: "Report created successfully",
      report,
      vehicle: updatedVehicle
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
 * - supports filters: city, status, categoryId, vehicleId, minSeverity, maxSeverity
 *   Example:
 *   /api/reports?city=Dhaka&status=VERIFIED&minSeverity=3
 * -----------------------------------------------------
 */
router.get("/", async (req, res) => {
  try {
    const {
      city,
      district,
      upazila,
      status,
      categoryId,
      vehicleId,
      severity,
      minSeverity,
      maxSeverity
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status; // PENDING / VERIFIED / FALSE
    }

    if (categoryId) {
      filter.issueCategory = categoryId;
    }

    if (vehicleId) {
      filter.vehicle = vehicleId;
    }

    if (severity !== undefined && severity !== "") {
      filter.severity = Number(severity);
    } 

    else if (minSeverity || maxSeverity) {
      filter.severity = {};
      if (minSeverity) filter.severity.$gte = Number(minSeverity);
      if (maxSeverity) filter.severity.$lte = Number(maxSeverity);
    }

    let reports = await Report.find(filter)
      .populate("location")
      .populate("issueCategory")
      .populate("vehicle")
      .populate("attachments");

    // City filter is on Location, so filter in-memory after populate
    if (city) {
      reports = reports.filter(
        r => r.location && r.location.city === city
      );
    }

    if (district) {
      reports = reports.filter(r => r.location && r.location.district === district);
    }

    if (upazila) {
      reports = reports.filter(r => r.location && r.location.upazila === upazila);
    }


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
      .populate("vehicle")
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
 * Helper endpoint for QR pre-fill.
 * - VEHICLE_QR: when qrValue matches a Vehicle.qrCode
 * - LOCATION_QR: legacy "City|Address|lat|lng" format
 * -----------------------------------------------------
 */
router.get("/from-qr/:qrValue", async (req, res) => {
  try {
    const { qrValue } = req.params;

    // 1) Try: VEHICLE QR
    const vehicle = await Vehicle.findOne({ qrCode: qrValue });
    if (vehicle) {
      const history = await Report.find({ vehicle: vehicle._id })
        .populate("issueCategory")
        .populate("location")
        .populate("attachments")
        .sort({ createdAt: -1 });

      return res.json({
        type: "VEHICLE_QR",
        vehicle,
        issueHistory: history
      });
    }

    // 2) Try: LOCATION QR  -> "City|Address|lat|lng"
    const parts = qrValue.split("|");
    if (parts.length === 4) {
      const [city, address, latStr, lngStr] = parts;
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates in QR" });
      }

      return res.json({
        type: "LOCATION_QR",
        city,
        address,
        latitude,
        longitude
      });
    }

    // 3) If neither vehicle nor location format
    return res.status(400).json({ message: "QR code not recognized" });
  } catch (err) {
    console.error("QR parse error:", err);
    return res.status(500).json({ message: "Error parsing QR value", error: err.message });
  }
});

/**
 * -----------------------------------------------------
 * PATCH /api/reports/:id/status
 * Admin-only:
 * - Update report status: PENDING / VERIFIED / FALSE
 * (Used in admin dashboard for verification)
 * -----------------------------------------------------
 */
router.patch("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "VERIFIED", "FALSE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("location")
      .populate("issueCategory")
      .populate("vehicle")
      .populate("attachments");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json({
      message: "Status updated",
      report
    });
  } catch (err) {
    console.error("Error updating report status:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
