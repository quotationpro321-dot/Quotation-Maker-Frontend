import { env } from "@/config/env";
import axios, { AxiosRequestConfig } from "axios";

const baseUrl =
  process.env.NODE_ENV === "production" ? "/api/v1" : env.NEXT_PUBLIC_API_BASE;

/**
 * Auth: httpOnly cookies only (backend `setAuthCookie`). Do not read/write tokens
 * in JS or localStorage — `withCredentials` sends cookies on each request.
 */
export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

let isRefreshing = false;

let pendingQueue: {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });

  pendingQueue = [];
};

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // console.log("Request failed", error.response.data.message);

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    const message =
      error.response?.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? String((error.response.data as { message?: unknown }).message)
        : "";

    if (
      error.response?.status === 500 &&
      message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        // Refresh uses httpOnly `refreshToken` cookie; response sets new cookies.
        await axiosInstance.post("/auth/refresh-token");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
