const express = require("express");
const router = express.Router();
const path = require("path");

const upload = require("../config/upload");
const MediaAttachment = require("../models/MediaAttachment");

// POST /api/upload/media
router.post("/media", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const mediaType = req.body.mediaType || "PHOTO";  // or detect from file.mimetype

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = `/uploads/${file.filename}`;

    const media = await MediaAttachment.create({
      url,
      mediaType
    });

    res.status(201).json({
      message: "File uploaded successfully",
      media
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload error", error: err.message });
  }
});

module.exports = router;
