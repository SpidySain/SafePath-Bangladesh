const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    // "USER" (normal citizen) or "ADMIN"
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
