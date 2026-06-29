const express = require("express");

const router = express.Router();

const {
  fetchVehicles
} = require("../controllers/vehicleController");

router.get("/vehicles", fetchVehicles);

module.exports = router;