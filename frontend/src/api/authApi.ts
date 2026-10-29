import type { LoginRequest } from "../types/auth";
import { AUTH_TOKEN_KEY } from "./axiosInstance";
import { apiRequest } from "./client";

interface AuthTokenResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<void> {
    const result = await apiRequest<string | AuthTokenResponse>(
      "/api/auth/login",
      {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify(credentials),
      },
    );
    const token =
      typeof result === "string"
        ? result
        : result.token || result.accessToken || result.jwt;
    if (!token) {
      throw new Error("La respuesta de autenticación no contiene un JWT.");
    }
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.dispatchEvent(new Event("authchange"));
  },
};
