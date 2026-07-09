import { AxiosRequestConfig, AxiosResponse } from "axios";
import api from "./axios.config";

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

interface HttpRequestProps<T = AxiosRequestConfig, U = unknown> {
  url: string;
  method: HttpMethods;
  options?: T;
  payload?: U;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
}

export const httpRequest = async <T = AxiosRequestConfig, U = unknown>({
  url,
  method,
  options,
  payload,
  params,
  signal,
}: HttpRequestProps<T, U>) => {
  const response: AxiosResponse = await api({
    ...(options as AxiosRequestConfig),
    url,
    method,
    data: payload,
    params,
    signal,
  });

  return {
    ...response.data,
    statusCode: response.status,
  };
};

export const setAxiosAuthHeader = (authToken: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
};