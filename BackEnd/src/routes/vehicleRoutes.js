const express = require("express");

const router = express.Router();

const { fetchLiveData } = require("../controllers/vehicleController");

router.get("/vehicle-data", fetchLiveData);

module.exports = router;