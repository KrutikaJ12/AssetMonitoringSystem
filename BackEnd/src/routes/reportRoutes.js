const express = require("express");

const router = express.Router();

const {
    getAssetSummaryReports,
    getSpeedViolationReports,
    getStartStopReports,
    getMovementReports,
    getStopReports
} = require("../controllers/reportController");

const authenticateToken = require("../middleware/authenticateToken");

//Asset-Summary Report
router.post(
    "/assets-summary",
    authenticateToken,
    getAssetSummaryReports
);

// Speed Violation Report
router.get(
    "/speed-violation",
    authenticateToken,
    getSpeedViolationReports
);


// Start Stop Report
router.get(
    "/start-stop",
    authenticateToken,
    getStartStopReports
);


// Movement Report
router.get(
    "/movement",
    authenticateToken,
    getMovementReports
);


// Stop Report
router.get(
    "/stop",
    authenticateToken,
    getStopReports
);


module.exports = router;