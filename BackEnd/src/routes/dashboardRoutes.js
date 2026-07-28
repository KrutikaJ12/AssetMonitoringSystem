const express=require('express');
const router=express.Router();
const { getDashboard } = require("../controllers/dashboardController");
const authenticateToken=require("../middleware/authenticateToken")


router.get("/dashboard", authenticateToken,getDashboard);

module.exports = router;