import { httpRequest, HttpMethods } from "../services";

export const getDashboard = () => {
  return httpRequest({
    url: "/dashboard",
    method: HttpMethods.GET,
  });
};