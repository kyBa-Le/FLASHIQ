import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { refreshToken, logout } from "./auth.service";
import { toast } from "sonner";

export const API_BASE = import.meta.env.VITE_API_BASE || "";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log(originalRequest.headers.Authorization);
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        await logout();
        return Promise.reject(refreshError);
      }
    }

    let isRateLimitToastShown = false;
    if (error.response?.status === 429) {
      if (!isRateLimitToastShown) {
        isRateLimitToastShown = true;
        toast.error("Too many requests. Please try again later");

        setTimeout(() => {
          isRateLimitToastShown = false;
        }, 5000);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
