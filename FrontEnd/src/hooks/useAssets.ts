import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetData,
  getAssetsData,
  updateAssetData,
} from "../api/assetApi";

export const useGetAssets = (siteId = null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["assets", siteId],
    queryFn: () => getAssetsData(siteId),
    //  enabled: !!siteId ,  //It prevents the API from being called before the user selects a site.
    // enabled: Boolean(siteId),
    // staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export const useCreateAsset = () => {
  return useMutation({
    mutationFn: createAssetData,
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assetId, assetData }) => updateAssetData(assetId, assetData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/sites"],
      });
    },
  });
};
