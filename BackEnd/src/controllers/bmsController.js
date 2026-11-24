
const bmsService = require("../services/bmsService");

const getBMSInsights = async (req, res) => {
    try {
        const assetId = Number(req.params.assetId);
        const customerId = req.auth.customerId;

        if (!Number.isInteger(assetId) || assetId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Asset ID.",
            });
        }

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Customer information not found.",
            });
        }

        const data = await bmsService.getBMSInsights(
            assetId,
            customerId
        );

        if (!data.batteryInfo) {
            return res.status(404).json({
                success: false,
                message: "Battery information not found for this asset.",
            });
        }

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get BMS Insights Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch BMS insights.",
        });
    }
};

module.exports = {
    getBMSInsights,
};
