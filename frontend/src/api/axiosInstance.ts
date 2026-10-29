import axios, { type InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  window.__ENV__?.API_BASE_URL ||
  "/api"
).replace(/\/+$/, "");

export const AUTH_TOKEN_KEY = "tech-store-auth-token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const requestConfig = config as InternalAxiosRequestConfig & {
    skipAuth?: boolean;
  };
  if (!requestConfig.skipAuth) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) requestConfig.headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    requestConfig.data !== undefined &&
    !requestConfig.headers.has("Content-Type")
  ) {
    requestConfig.headers.set("Content-Type", "application/json");
  }
  delete requestConfig.skipAuth;
  return requestConfig;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new Event("authchange"));
    }
    return Promise.reject(error);
  },
);

export default api;
