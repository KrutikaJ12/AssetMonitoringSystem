import { httpRequest, HttpMethods } from "../services";

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