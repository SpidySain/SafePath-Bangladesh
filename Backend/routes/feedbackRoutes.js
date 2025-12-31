const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

/**
 * POST /api/feedback
 * Create feedback (requires login)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { rating, message } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const fb = await Feedback.create({
      userId: req.user?._id || null,
      userName: req.user?.name || req.user?.email || "User",
      rating,
      message
    });

    res.status(201).json(fb);
  } catch (err) {
    console.error("Feedback create error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/feedback?limit=3
 * Public list (latest first)
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 0, 100) || 0;

    const list = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(list);
  } catch (err) {
    console.error("Feedback list error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// DELETE feedback (ADMIN ONLY)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
