import { HttpMethods, httpRequest } from "../services";

export const getUsersData = () => {
  return httpRequest({
    url: "/users",
    method: HttpMethods.GET,
  });
};

export const getUserData = (userId: string) => {
  return httpRequest({
    url: `/users/${userId}`,
    method: HttpMethods.GET,
  });
};

export const createUserData = (userData: any) => {
  return httpRequest({
    url: "/users",
    method: HttpMethods.POST,
    payload: userData,
  });
};

export const updateUserData = (userId: string, userData: any) => {
  return httpRequest({
    url: `/users/${userId}`,
    method: HttpMethods.PUT,
    payload: userData,
  });
};

export const deleteUserData = (userId: string) => {
  return httpRequest({
    url: `/users/${userId}`,
    method: HttpMethods.DELETE,
  });
};