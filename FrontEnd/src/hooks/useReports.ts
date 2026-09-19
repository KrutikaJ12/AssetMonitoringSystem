import { useQuery } from "@tanstack/react-query";

import {
    getSpeedViolationReports,
    getStartStopReports,
    getMovementReports,
    getStopReports,
} from "../api/reportsApi";


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