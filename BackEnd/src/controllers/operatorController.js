const operatorService = require("../services/operatorService");

async function getOperators (req,res) {
    console.log("Req",req)
   try{
   const customerId = req.auth.customerId;
   if(!customerId){
        return res.status(400).json({
                success: false,
                message: "Customer information is missing.",
            });
     }
    const operators = await operatorService.getOperators(customerId)
    return res.status(200).json({
        success : true,
        data : operators
    })
   }catch(error){
    console.error("Get operators error:", error);
     return res.status(500).json({
        success : false,
        message : "Unable to fetch sites.",
    })
   }
}
async function createOperator (req,res) {
  try{
    const customerId = req.auth.customerId;
    const userId = req.auth.userId;
    const {
    operatorName,
    mobileNo,
    licenseNo,
    siteId,
    assetId,
    isActive
} = req.body;
    const result= await operatorService.createOperator(
       {
    operatorName,
    mobileNo,
    licenseNo,
    siteId,
    assetId,
    isActive
    } ,customerId,userId,req.ip
    );
   
     return res.status(200).json({
        success : true,
        message : "Operator created sucessfully.",
    })
  }catch(error){
    console.error("Create operators error:", error);
     return res.status(500).json({
        success : false,
        message : "Unable to create operator.",
    })
  }
}
async function updateOperator (req,res) {
   try{
    const customerId = req.auth.customerId;
    const operatorId = req.params.id;
    const userId = req.auth.userId;
    const result= await operatorService.updateOperator(operatorId,customerId,req.body,userId,req.ip)
    return res.status(200).json({
      success : true,
      operator : result,
      message : "Operator created successfully"
    })
   }catch(error){
      console.error("Update operator error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update operator."
        });
   }

}
module.exports = {getOperators,createOperator,updateOperator}