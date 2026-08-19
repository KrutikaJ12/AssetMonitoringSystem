import {
  createUserData,
  getUsersData,
  updateUserData,
  deleteUserData,
} from "../api/userApi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// GET - Read Users
export const useUsers = () => {
  return useQuery({
    queryKey: ["/users"],
    queryFn: async () => {
      const response = await getUsersData();

      return response.data;
    },
  });
};
// POST - Create User
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/users"],
      });
    },
  });
};

// PUT - Update User
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

// DELETE - Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserData,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/users"],
      });
    },
  });
};