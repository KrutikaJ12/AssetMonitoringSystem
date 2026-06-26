const express = require("express");

const router = express.Router();

const {
  getAccessToken,
} = require("../controllers/tokenController");

router.post("/token", (req, res, next) => {
  next();
}, getAccessToken);

module.exports = router;