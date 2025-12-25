const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
// Debug: simple request logging to aid static file serving troubleshooting
app.use((req, res, next) => {
  console.log('REQ', req.method, req.path);
  next();
});
// serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// serve frontend static files from top-level Frontend folder
app.use(express.static(path.join(__dirname, '..', 'Frontend')));
console.log('Static assets served from:', path.join(__dirname, 'public'));

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

const vehicleRoutes = require("./routes/vehicleRoutes");
app.use("/api/vehicles", vehicleRoutes);

const ratingRoutes = require("./routes/ratingRoutes");
app.use("/api/ratings", ratingRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const alertRoutes = require("./routes/alertRoutes");
app.use("/api/alerts", alertRoutes);


// SPA fallback: route unrecognized paths to index.html so client-side routing works
// SPA fallback: if request seems to accept HTML and is not an API route
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (!req.accepts || !req.accepts('html')) return next();
  // don't return index.html for API routes or uploads
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads')) return next();
  // if request looks like it wants a static asset (has a dot), skip
  if (req.path.includes('.')) return next();
  res.sendFile(path.join(__dirname, "..", "Frontend", "index.html"));

});

// ensure required env is present
if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== "string") {
  console.error("MONGO_URI is not set. See .env.example and set MONGO_URI accordingly.");
  process.exit(1);
}
if (!process.env.JWT_SECRET || typeof process.env.JWT_SECRET !== "string") {
  console.error("JWT_SECRET is not set. Add JWT_SECRET to your .env file (see .env.example).");
  process.exit(1);
}
// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
