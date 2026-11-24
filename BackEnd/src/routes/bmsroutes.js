
const express = require("express");
const router = express.Router();

const { getBMSInsights } = require("../controllers/bmsController");

// Import authenticateToken using the same path
// used in your existing dashboardRoutes.js.
const authenticateToken = require("../middleware/authenticateToken");

router.get("/:assetId", authenticateToken, getBMSInsights);

module.exports = router;
