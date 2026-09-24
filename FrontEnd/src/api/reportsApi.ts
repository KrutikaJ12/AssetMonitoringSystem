import { httpRequest, HttpMethods } from "../services";

// Asset Summary Report
export const getAssetSummaryReports = (data: {
    assetId: number;
    fromDate: string;
    toDate: string;
    reportType: "day" | "week" | "month";
}) => {
    return httpRequest({
        url: "/reports/assets-summary",
        method: HttpMethods.POST,
        payload:data,
    });
};
// Speed Violation Report
export const getSpeedViolationReports = () => {
    return httpRequest({
        url: "/reports/speed-violation",
        method: HttpMethods.GET,
    });
};

// Start Stop Report
export const getStartStopReports = () => {
    return httpRequest({
        url: "/reports/start-stop",
        method: HttpMethods.GET,
    });
};

// Movement Report
export const getMovementReports = () => {
    return httpRequest({
        url: "/reports/movement",
        method: HttpMethods.GET,
    });
};

// Stop Report
export const getStopReports = () => {
    return httpRequest({
        url: "/reports/stop",
        method: HttpMethods.GET,
    });
};

// =====================================================
// Asset Report Details
// =====================================================
export const getAssetReportDetail = (params: {
    assetId: number;
    fromDate: string;
    toDate: string;
    reportType: "day" | "week" | "month";
}) => {
    return httpRequest({
        url: "/reports/asset-details",
        method: HttpMethods.GET,
        params,
    });
};