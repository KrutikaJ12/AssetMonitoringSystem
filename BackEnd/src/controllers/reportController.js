const reportService = require("../services/reportService");
// ======================================================
// ASSET SUMMARY REPORT
// ======================================================

async function getAssetSummaryReports(req, res) {
    try {

        const reports = await reportService.getAssetSummaryReports(
            req.body
        );

        return res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error("Get asset summary reports error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch asset summary reports."
        });
    }
}

// ======================================================
// SPEED VIOLATION REPORT
// ======================================================

async function getSpeedViolationReports(req, res) {
    try {

        const reports = await reportService.getSpeedViolationReports();

        return res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error("Get speed violation reports error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch speed violation reports."
        });
    }
}


// ======================================================
// START STOP REPORT
// ======================================================

async function getStartStopReports(req, res) {
    try {

        const reports = await reportService.getStartStopReports();

        return res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error("Get start stop reports error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch start stop reports."
        });
    }
}


// ======================================================
// MOVEMENT REPORT
// ======================================================

async function getMovementReports(req, res) {
    try {

        const reports = await reportService.getMovementReports();

        return res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error("Get movement reports error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch movement reports."
        });
    }
}


// ======================================================
// STOP REPORT
// ======================================================

async function getStopReports(req, res) {
    try {

        const reports = await reportService.getStopReports();

        return res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error("Get stop reports error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch stop reports."
        });
    }
}



// ======================================================
// ASSET DETAIL REPORT
// ======================================================

// async function getAssetReportDetails(req, res) {
//     try {

//         const { assetId } = req.params;

//         console.log("Asset Detail Request:", assetId);

//         if (!assetId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Asset ID is required."
//             });
//         }

//         const report =
//             await reportService.getAssetReportDetails(assetId);

//         if (!report) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Asset report details not found."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: report
//         });

//     } catch (error) {

//         console.error(
//             "Get asset report details error:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: "Unable to fetch asset report details.",
//             error: error.message
//         });
//     }
// }
async function getAssetReportDetails(req, res) {
    try {
        const {
            assetId,
            fromDate,
            toDate,
            reportType,
        } = req.query;

        if (!assetId || !fromDate || !toDate || !reportType) {
            return res.status(400).json({
                success: false,
                message:
                    "assetId, fromDate, toDate and reportType are required.",
            });
        }

        const report = await reportService.getAssetReportDetails({
            assetId: Number(assetId),
            fromDate,
            toDate,
            reportType,
        });

        return res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Get asset report detail error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch asset report detail.",
        });
    }
}


module.exports = {
    getSpeedViolationReports,
    getStartStopReports,
    getMovementReports,
    getStopReports,
    getAssetSummaryReports,
    getAssetReportDetails
};