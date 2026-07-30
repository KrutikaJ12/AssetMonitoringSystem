const express = require("express");
const rateLimit = require("express-rate-limit");

const { login,logout } = require("../controllers/authController");
const authenticateToken=require("../middleware/authenticateToken")

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Try again later."
    }
});

router.post("/login", loginLimiter, login);
router.post(
    "/logout",
    authenticateToken,
   logout
);

module.exports = router;