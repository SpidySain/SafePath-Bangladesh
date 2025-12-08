const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");
const Report = require("../models/Report");
const Location = require("../models/Location");
const IssueCategory = require("../models/IssueCategory");
const Rating = require("../models/Rating");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

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

module.exports = router;
