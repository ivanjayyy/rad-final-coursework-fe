import axios, { AxiosError } from "axios";
import { refreshTokenCall } from "./auth";

// create axios instance
const api = axios.create({
  baseURL: "https://rad-final-coursework-be-ynt7.vercel.app/api/v1",
});

// public endpoints
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

// request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
    config.url?.includes(endpoint),
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // access token was expired
    const originalRequest: any = error.config;

    // public endpoints do not require access token
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest.url?.includes(endpoint),
    );

    if (
      error.response?.status === 401 &&
      !isPublic &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken") as string;

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        // refresh token and try again
        const response = await refreshTokenCall(refreshToken);
        const newAccessToken = response.data.accessToken;

        // update access token
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        // redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        console.error(err);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
