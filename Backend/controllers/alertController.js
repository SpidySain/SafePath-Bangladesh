const Alert = require("../models/Alert");
const Report = require("../models/Report");

/**
 * Citizen: get active alerts
 */
exports.getActiveAlerts = async (req, res) => {
  const alerts = await Alert.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(5);
  res.json(alerts);
};

/**
 * Admin: list all alerts
 */
exports.adminGetAlerts = async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
};

/**
 * Admin: create alert (only from VERIFIED reports if linked)
 */
exports.adminCreateAlert = async (req, res) => {
  const { title, message, city, district, upazila, level, sourceReportId } = req.body;

  if (sourceReportId) {
    const report = await Report.findById(sourceReportId);
    if (!report || report.status !== "VERIFIED") {
      return res.status(400).json({ message: "Alert must be linked to a VERIFIED report" });
    }
  }

  const alert = await Alert.create({
    title,
    message,
    city,
    district,
    upazila,
    level,
    sourceReportId
  });

  res.status(201).json(alert);
};

/**
 * Admin: update alert
 */
exports.adminUpdateAlert = async (req, res) => {
  const updated = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Alert not found" });
  res.json(updated);
};

/**
 * Admin: delete alert
 */
exports.adminDeleteAlert = async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
