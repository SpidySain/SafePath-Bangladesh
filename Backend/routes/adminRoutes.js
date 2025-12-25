const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");
const Report = require("../models/Report");
const Location = require("../models/Location");
const IssueCategory = require("../models/IssueCategory");
const Rating = require("../models/Rating");
const Vehicle = require("../models/Vehicle");
const router = express.Router();
const {
  adminGetAlerts,
  adminCreateAlert,
  adminUpdateAlert,
  adminDeleteAlert
} = require("../controllers/alertController");

// All routes here require admin
router.use(authMiddleware, adminOnly);

/**
 * GET /api/admin/summary
 * High-level dashboard stats
 */
router.get("/summary", async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const verifiedReports = await Report.countDocuments({ status: "VERIFIED" });
    const pendingReports = await Report.countDocuments({ status: "PENDING" });
    const falseReports = await Report.countDocuments({ status: "FALSE" });

    const totalLocations = await Location.countDocuments();
    const totalCategories = await IssueCategory.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.json({
      totalReports,
      verifiedReports,
      pendingReports,
      falseReports,
      totalLocations,
      totalCategories,
      totalVehicles,
      totalRatings
    });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/admin/monthly-reports
 * Returns count of reports per month (simple)
 */
router.get("/monthly-reports", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ];

    const results = await Report.aggregate(pipeline);

    const formatted = results.map(r => ({
      year: r._id.year,
      month: r._id.month,
      count: r.count
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Monthly reports error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/admin/monthly-analytics
 * Returns monthly counts broken down by status (VERIFIED/PENDING/FALSE)
 * Optional query: year=YYYY (filter to a year)
 */
router.get("/monthly-analytics", async (req, res) => {
  try {
    const yearFilter = req.query.year ? Number(req.query.year) : null;

    const match = {};
    if (yearFilter) {
      const start = new Date(yearFilter, 0, 1);
      const end = new Date(yearFilter + 1, 0, 1);
      match.createdAt = { $gte: start, $lt: end };
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.status": 1 } }
    ];

    const results = await Report.aggregate(pipeline);

    // pivot results into { year, month, VERIFIED, PENDING, FALSE }
    const map = {};
    results.forEach(r => {
      const key = `${r._id.year}-${String(r._id.month).padStart(2, "0")}`;
      if (!map[key]) {
        map[key] = { year: r._id.year, month: r._id.month, VERIFIED: 0, PENDING: 0, FALSE: 0 };
      }
      map[key][r._id.status] = r.count;
    });

    const formatted = Object.values(map).sort((a, b) => (a.year - b.year) || (a.month - b.month));

    res.json(formatted);
  } catch (err) {
    console.error("Monthly analytics error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/admin/export
 * Export reports as CSV for a given period.
 * Query parameters:
 *  - year (e.g., 2025)
 *  - month (1-12) [optional - if provided, export that month]
 *  - start / end ISO dates (optional range)
 */
router.get("/export", async (req, res) => {
  try {
    const { year, month, start, end } = req.query;

    let filter = {};

    if (start || end) {
      filter.createdAt = {};
      if (start) filter.createdAt.$gte = new Date(start);
      if (end) filter.createdAt.$lte = new Date(end);
    } else if (year) {
      const y = Number(year);
      const m = month ? Number(month) - 1 : 0;
      const startDate = new Date(y, m, 1);
      const endDate = month ? new Date(y, m + 1, 1) : new Date(y + 1, 0, 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const reports = await Report.find(filter)
      .populate("location")
      .populate("issueCategory")
      .populate("vehicle")
      .sort({ createdAt: 1 });

    // CSV header
    const headers = [
      "reportId",
      "createdAt",
      "reporterId",
      "city",
      "district",
      "address",
      "issueCategory",
      "severity",
      "status",
      "vehicle",
      "description"
    ];

    const csvRows = [headers.join(",")];

    reports.forEach(r => {
      const row = [
        r._id,
        r.createdAt.toISOString(),
        r.reporterId || "",
        r.location?.city || "",
        r.location?.district || "",
        `"${(r.location?.address || "").replace(/"/g, '""')}",`,
        r.issueCategory?.name || "",
        r.severity || "",
        r.status || "",
        r.vehicle?.registrationNumber || r.vehicle?.numberPlate || "",
        `"${(r.description || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=reports_export_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/admin/top-categories
 * returns issues grouped by category
 */
router.get("/top-categories", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$issueCategory",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const results = await Report.aggregate(pipeline);

    // populate category names
    const withNames = await IssueCategory.populate(results, {
      path: "_id",
      select: "name"
    });

    const formatted = withNames.map(r => ({
      categoryId: r._id._id,
      categoryName: r._id.name,
      count: r.count
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Top categories error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/admin/red-zones
 * Very simple "red zone" logic:
 *  - count VERIFIED reports per city
 *  - if >= threshold, mark as red
 */
router.get("/red-zones", async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    // join reports with locations
    const pipeline = [
      { $match: { status: "VERIFIED" } },
      {
        $lookup: {
          from: "locations", // collection name (lowercase plural)
          localField: "location",
          foreignField: "_id",
          as: "location"
        }
      },
      { $unwind: "$location" },
      {
        $group: {
          _id: "$location.city",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ];

    const results = await Report.aggregate(pipeline);

    const zones = results.map(r => ({
      city: r._id,
      reportCount: r.count,
      level: r.count >= threshold ? "RED" : "YELLOW"
    }));

    res.json(zones);
  } catch (err) {
    console.error("Red zones error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/alerts", adminGetAlerts);

// POST /api/admin/alerts
router.post("/alerts", adminCreateAlert);

// PATCH /api/admin/alerts/:id
router.patch("/alerts/:id", adminUpdateAlert);

// DELETE /api/admin/alerts/:id
router.delete("/alerts/:id", adminDeleteAlert);

module.exports = router;
