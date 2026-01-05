const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // "USER" (normal citizen) or "ADMIN"
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },

    // Req 5 – Feature 4: Alert subscription toggle
    receiveAlerts: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

