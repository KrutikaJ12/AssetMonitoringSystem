const express = require("express")
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const {getAssets,createAsset,updateAsset} = require("../controllers/assetController");


router.get("/assets",authenticateToken,getAssets);
router.post("/assets",authenticateToken,createAsset)
router.put( "/assets/:id",authenticateToken,updateAsset);
module.exports=router;