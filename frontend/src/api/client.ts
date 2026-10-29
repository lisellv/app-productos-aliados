import axios, { type AxiosRequestConfig } from "axios";
import api, { API_BASE_URL, AUTH_TOKEN_KEY } from "./axiosInstance";

export { AUTH_TOKEN_KEY };

interface RequestOptions extends Omit<
  AxiosRequestConfig,
  "baseURL" | "data" | "url"
> {
  body?: unknown;
  skipAuth?: boolean;
}

// Conserva la interfaz simple de los servicios y normaliza errores HTTP.
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, skipAuth = false, ...requestOptions } = options;
  const baseIncludesApi = API_BASE_URL.endsWith("/api");
  const pathIncludesApi = path.startsWith("/api/");
  const requestPath =
    baseIncludesApi === pathIncludesApi
      ? baseIncludesApi
        ? path.slice(4)
        : `/api${path.startsWith("/") ? path : `/${path}`}`
      : path;
  try {
    const response = await api.request<T>({
      ...requestOptions,
      url: requestPath,
      data: body,
      skipAuth,
    } as AxiosRequestConfig & { skipAuth: boolean });
    if (response.status === 204 || response.data === "") return null as T;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) throw new TypeError("Failed to fetch");

      const responseBody = error.response.data;
      if (typeof responseBody === "string" && responseBody) {
        throw new Error(responseBody);
      }
      if (responseBody && typeof responseBody === "object") {
        const details = responseBody as {
          message?: unknown;
          error?: unknown;
          detail?: unknown;
        };
        const message = details.message || details.error || details.detail;
        if (typeof message === "string" && message) throw new Error(message);
      }
      throw new Error(`Error del servidor (${error.response.status})`);
    }
    throw error;
  }
}
