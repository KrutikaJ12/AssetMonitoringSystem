
import { createSiteData, getsitesData, updateSiteData } from "../api/siteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSites = () => {
    return useQuery({
      queryKey:['/sites'] ,
      queryFn:getsitesData 
    })
}

export const useCreateSite = () => {
    return useMutation({
        mutationFn: createSiteData
    });
};

export const useUpdateSite = () => {
     const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ siteId, siteData }) =>
            updateSiteData(siteId, siteData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/sites"],
            });
        },
    });
    
};