import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { AUTH_TOKEN_KEY } from "../api/client";
import type { JwtClaims } from "../types";

interface AuthState {
  user: JwtClaims | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canAccessManagement: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function readClaims(): JwtClaims | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payload)) as JwtClaims;
    return (claims.exp || 0) * 1000 > Date.now() ? claims : null;
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }
}

// Comparte el estado de sesión y los permisos para las pantallas protegidas.
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<JwtClaims | null>(readClaims);

  useEffect(() => {
    const refresh = () => setClaims(readClaims());
    window.addEventListener("storage", refresh);
    window.addEventListener("authchange", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("authchange", refresh);
    };
  }, []);

  const roles = Array.isArray(claims?.roles)
    ? claims.roles
    : String(claims?.roles || "")
        .split(",")
        .map((role) => role.trim());
  return (
    <AuthContext.Provider
      value={{
        user: claims,
        isAuthenticated: Boolean(claims),
        isAdmin: roles.includes("ROLE_ADMIN"),
        canAccessManagement: roles.some((role) =>
          ["ROLE_ADMIN", "ROLE_ALIADO"].includes(role),
        ),
        login: (username, password) =>
          authApi.login({ userName: username, password }),
        logout: () => {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setClaims(null);
          navigate("/", { replace: true });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}
