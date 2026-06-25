const express = require("express");

const router = express.Router();

const {
  getAccessToken,
} = require("../controllers/tokenController");

router.post("/token", getAccessToken);

module.exports = router;