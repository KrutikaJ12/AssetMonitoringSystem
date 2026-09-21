import { useMutation, useQuery } from "@tanstack/react-query";

import {
    getSpeedViolationReports,
    getStartStopReports,
    getMovementReports,
    getStopReports,
    getAssetSummaryReports,
} from "../api/reportsApi";

// Asset Summary Report
export const useAssetSummaryReports = () => {
    return useMutation({
        mutationFn: getAssetSummaryReports,
    });
};
// Speed Violation Report
export const useSpeedViolationReports = () => {
    return useQuery({
        queryKey: ["speed-violation-reports"],
        queryFn: getSpeedViolationReports,
    });
};


// Start Stop Report
export const useStartStopReports = () => {
    return useQuery({
        queryKey: ["start-stop-reports"],
        queryFn: getStartStopReports,
    });
};


// Movement Report
export const useMovementReports = () => {
    return useQuery({
        queryKey: ["movement-reports"],
        queryFn: getMovementReports,
    });
};


// Stop Report
export const useStopReports = () => {
    return useQuery({
        queryKey: ["stop-reports"],
        queryFn: getStopReports,
    });
};