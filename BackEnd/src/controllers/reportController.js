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


module.exports = {
    getSpeedViolationReports,
    getStartStopReports,
    getMovementReports,
    getStopReports,
    getAssetSummaryReports
};