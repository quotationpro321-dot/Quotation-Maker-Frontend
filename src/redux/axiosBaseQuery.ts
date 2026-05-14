import { axiosInstance } from "@/lib/axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosRequestConfig } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
      let requestHeaders: AxiosRequestConfig["headers"] | undefined = headers;

      if (isFormData && headers && typeof headers === "object" && !Array.isArray(headers)) {
        const copy = { ...(headers as Record<string, unknown>) };
        delete copy["Content-Type"];
        requestHeaders = copy as AxiosRequestConfig["headers"];
      }

      const result = await axiosInstance({
        url: url,
        method,
        data,
        params,
        headers: requestHeaders,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
