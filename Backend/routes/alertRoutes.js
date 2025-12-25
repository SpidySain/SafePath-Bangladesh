const router = require("express").Router();
const { getActiveAlerts } = require("../controllers/alertController");

router.get("/", getActiveAlerts);

module.exports = router;
