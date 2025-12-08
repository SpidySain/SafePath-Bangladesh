const express = require("express");
const Rating = require("../models/Rating");
const Vehicle = require("../models/Vehicle");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/ratings
 * Body: { vehicleId, score, tags, comment }
 * User must be logged in
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { vehicleId, score, tags, comment } = req.body;

    if (!vehicleId || !score) {
      return res.status(400).json({ message: "vehicleId and score required" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(400).json({ message: "Invalid vehicleId" });
    }

    const rating = await Rating.create({
      user: req.user._id,
      vehicle: vehicleId,
      score,
      tags: tags || [],
      comment
    });

    res.status(201).json({ message: "Rating submitted", rating });
  } catch (err) {
    console.error("Create rating error:", err);
    res.status(500).json({ message: "Error submitting rating", error: err.message });
  }
});

/**
 * GET /api/ratings/vehicle/:vehicleId
 * Returns avg rating + all ratings
 */
router.get("/vehicle/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const ratings = await Rating.find({ vehicle: vehicleId })
      .populate("user", "name");

    if (!ratings.length) {
      return res.json({
        averageScore: null,
        count: 0,
        ratings: []
      });
    }

    const sum = ratings.reduce((acc, r) => acc + r.score, 0);
    const avg = sum / ratings.length;

    res.json({
      averageScore: avg,
      count: ratings.length,
      ratings
    });
  } catch (err) {
    console.error("Get vehicle ratings error:", err);
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
  }
});

module.exports = router;
