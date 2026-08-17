import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createOperatorData, getoperatorsData, updateOperatorData } from "../api/operatorApi"

 
export const useOperators =() =>{
    return useQuery({
        queryKey:["operators"],
        queryFn:getoperatorsData
    })
 }

 export const useCreateOperator = () => {
    return useMutation({
        mutationFn: createOperatorData
    })
 }

 export const useUpdateOperator = () => {
     const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ operatorId, operatorData }) =>
            updateOperatorData(operatorId, operatorData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/operators"],
            });
        },
    });
}