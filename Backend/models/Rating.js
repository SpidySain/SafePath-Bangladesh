const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    score: { type: Number, min: 1, max: 5, required: true },
    tags: [{ type: String }], // ["overspeeding", "sudden braking"]
    comment: { type: String }
  },
  { timestamps: true }
);

// ensure one user can rate a vehicle multiple times, or you can enforce unique
// ratingSchema.index({ user: 1, vehicle: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
