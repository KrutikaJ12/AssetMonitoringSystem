const express = require("express");
const router = express.Router();
const authenticateToken=require("../middleware/authenticateToken")

const {getOperators, createOperator, updateOperator} = require("../controllers/operatorController");

router.get("/operators",authenticateToken,getOperators);
router.post("/operators",authenticateToken,createOperator)
router.put("/operators/:id",authenticateToken,updateOperator)
module.exports = router
