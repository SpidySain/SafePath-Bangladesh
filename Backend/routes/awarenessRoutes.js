const router = require("express").Router();
const {
  getActiveAwareness,
  adminGetAwareness,
  adminCreateAwareness,
  adminUpdateAwareness,
  adminDeleteAwareness,
  adminToggleAwareness
} = require("../controllers/awarenessController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// Citizen routes
router.get("/", getActiveAwareness);

// Admin routes (require authentication + admin role)
router.get("/admin/all", authMiddleware, adminOnly, adminGetAwareness);
router.post("/admin/create", authMiddleware, adminOnly, adminCreateAwareness);
router.put("/admin/:id", authMiddleware, adminOnly, adminUpdateAwareness);
router.delete("/admin/:id", authMiddleware, adminOnly, adminDeleteAwareness);
router.patch("/admin/:id/toggle", authMiddleware, adminOnly, adminToggleAwareness);

module.exports = router;
