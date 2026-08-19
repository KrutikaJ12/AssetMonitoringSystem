const assetService = require("../services/assetService");

async function getAssets(req,res){
   try{
    const customerId = req.auth.customerId;
    if(!customerId){
        return res.status(400).json({
                success: false,
                message: "Customer information is missing.",
            });
    }
    const assets = await assetService.getAssets(customerId);

    return res.status(200).json({
        success:true,
        assetData:assets
    })
    
   }catch(error){
     console.error("Get assets error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch assets.",
        });
   }
}
async function createAsset(req,res){
   try{
     const customerId = req.auth.customerId;
     const {
    assetCode,
    assetName,
    assetTypeId,
    regNo,
    siteId,
    status
  } = req.body;
   const assets = await assetService.createAsset(
    {
    assetCode,
    assetName,
    assetTypeId,
    regNo,
    siteId,
    status
  },customerId
   );

   return res.status(200).json({
            success: true,
            message: "Assets created successfully",
        });

   }catch(error){
     console.error("Create assets error:", error);

        return res.status(400).json({
            success: false,
            message: "Unable to create operator.",
        });
   }
}
async function updateAsset(req,res){
   try{
    const customerId=req.auth.customerId;
    const assetId=req.params.id;
    const assets= await assetService.updateAsset(assetId,customerId,req.body);
    return res.status(200).json({
        success:true,
        assets:assets
    })
   }catch(error){
     console.error("Update assets error:", error);

        return res.status(400).json({
            success: false,
            message: "Unable to update operator.",
        });
   }
}
module.exports = {getAssets,createAsset,updateAsset}