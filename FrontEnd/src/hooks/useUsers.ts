
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserData, getusersData, updateUserData } from "../api/userApi";

export const useUsers = () => {
    return useQuery({
      queryKey:['/users'] ,
      queryFn:getusersData 
    })
}

export const useCreateUser = () => {
    return useMutation({
        mutationFn: createUserData
    });
};

export const useUpdateUser = () => {
     const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, userData }) =>
            updateUserData(userId, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["/users"],
            });
        },
    });
    
};