const router = require("express").Router();
const { getActiveAlerts, getAllAlerts } = require("../controllers/alertController");

router.get("/", getActiveAlerts);      // navbar/banner uses this
router.get("/all", getAllAlerts);      // view all history (expired included)

module.exports = router;
