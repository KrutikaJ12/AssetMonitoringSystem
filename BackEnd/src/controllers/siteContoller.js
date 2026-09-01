const siteService= require('../services/siteService');

async function getSites(req,res){
   try{
     const customerId=req.auth.customerId;
     if(!customerId){
        return res.status(400).json({
                success: false,
                message: "Customer information is missing.",
            });
     }
     const sites = await siteService.getSites(customerId);
     return res.status(200).json({
        success : true,
        data : sites
     })

   }catch(error){
    console.error("Get sites error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch sites.",
        });
    
   }
}
async function createSite(req, res) {
    try {
        const customerId = req.auth.customerId;
        const userId = req.auth.userId;
        const {
            siteName,
            locationName,
            latitude,
            longitude,
            isActive
        } = req.body;

        const result = await siteService.createSite(
            {
                siteName,
                locationName,
                latitude,
                longitude,
                isActive
            },
            customerId,
            userId,
            req.ip
        );

        return res.status(201).json({
            success: true,
            message: "Site created successfully.",
            site: result
        });

    } catch (error) {
        console.error("Create site error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create site."
        });
    }
}
async function updateSite(req, res) {
    try {
        const siteId = req.params.id;
        const customerId = req.auth.customerId;
        const userId = req.auth.userId;
        const result = await siteService.updateSite(
            siteId,
            req.body,
            customerId,
            userId,
            req.ip
        );

        return res.status(200).json({
            success: true,
            message: "Site updated successfully.",
            site: result
        });

    } catch (error) {
        console.error("Update site error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update site."
        });
    }
}
module.exports = {getSites,createSite,updateSite}