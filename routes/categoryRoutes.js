const express = require("express");
const router = express.Router();
const IssueCategory = require("../models/IssueCategory");

// create a category
router.post("/", async (req, res) => {
  try {
    const category = await IssueCategory.create({
      name: req.body.name,
      description: req.body.description
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
});

// list categories
router.get("/", async (req, res) => {
  try {
    const categories = await IssueCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
});

module.exports = router;
