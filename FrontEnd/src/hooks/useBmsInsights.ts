import { useQuery } from "@tanstack/react-query";
import { getBmsData } from "../api/bmsInsightsApi";

export const useGetBmsData = (assetId) => {
    return useQuery({
        queryKey: ["/bms", assetId],
        queryFn: () => getBmsData(assetId),
        enabled: !!assetId,
    });
};