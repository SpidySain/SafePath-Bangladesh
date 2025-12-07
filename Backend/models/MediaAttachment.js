const mongoose = require("mongoose");

const mediaAttachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },              // e.g. /uploads/xyz.jpg
    mediaType: { type: String, enum: ["PHOTO", "VIDEO"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MediaAttachment", mediaAttachmentSchema);
