import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAssetData, getAssetsData, updateAssetData } from "../api/assetApi"


export const useGetAsstes =()=>{
    return useQuery({
        queryKey:['asstes'],
        queryFn:getAssetsData
    })
}

 export const useCreateAsset = () => {
    return useMutation({
        mutationFn: createAssetData
    })
 }

 export const useUpdateAsset = () => {
     const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ assetId,assetData }) =>
            updateAssetData(assetId,assetData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/sites"],
            });
        },
    });
    
};