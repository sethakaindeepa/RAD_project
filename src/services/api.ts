
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { refreshTokenCall } from "././auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const PUBLIC_ENDPOINT = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  const isPublic = PUBLIC_ENDPOINT.some((url) =>
    config.url?.includes(url)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _isRefresh?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isPublic = PUBLIC_ENDPOINT.some((url) =>
      originalRequest.url?.includes(url)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._isRefresh &&
      !isPublic
    ) {
      originalRequest._isRefresh = true;

      try {
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await refreshTokenCall(refreshToken);
        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem("ACCESS_TOKEN", newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
