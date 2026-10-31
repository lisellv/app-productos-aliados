import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { apiAutenticacion } from "../api/autenticacionApi";
import { CLAVE_TOKEN_AUTENTICACION } from "../api/instanciaAxios";
import type { JwtClaims } from "../types/modelos";

interface EstadoAutenticacion {
  usuario: JwtClaims | null;
  estaAutenticado: boolean;
  esAdministrador: boolean;
  esAliado: boolean;
  puedeAdministrar: boolean;
  iniciarSesion: (nombreUsuario: string, clave: string) => Promise<void>;
  cerrarSesion: () => void;
}

const ContextoAutenticacion = createContext<EstadoAutenticacion | null>(null);

function leerAfirmaciones(): JwtClaims | null {
  const tokenJwt = localStorage.getItem(CLAVE_TOKEN_AUTENTICACION);
  if (!tokenJwt) return null;
  try {
    const carga = tokenJwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const afirmaciones = JSON.parse(atob(carga)) as JwtClaims;
    return (afirmaciones.exp || 0) * 1000 > Date.now() ? afirmaciones : null;
  } catch {
    localStorage.removeItem(CLAVE_TOKEN_AUTENTICACION);
    return null;
  }
}

// Comparte el estado de sesión y los permisos para las pantallas protegidas.
export function AuthProvider({ children: contenido }: { children: ReactNode }) {
  const navegar = useNavigate();
  const [afirmaciones, setAfirmaciones] = useState<JwtClaims | null>(
    leerAfirmaciones,
  );

  useEffect(() => {
    const actualizarSesion = () => setAfirmaciones(leerAfirmaciones());
    window.addEventListener("storage", actualizarSesion);
    window.addEventListener("authchange", actualizarSesion);
    return () => {
      window.removeEventListener("storage", actualizarSesion);
      window.removeEventListener("authchange", actualizarSesion);
    };
  }, []);

  const rolesUsuario = Array.isArray(afirmaciones?.roles)
    ? afirmaciones.roles
    : String(afirmaciones?.roles || "")
        .split(",")
        .map((rol) => rol.trim());
  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario: afirmaciones,
        estaAutenticado: Boolean(afirmaciones),
        esAdministrador: rolesUsuario.includes("ROLE_ADMIN"),
        esAliado: rolesUsuario.includes("ROLE_ALIADO"),
        puedeAdministrar: rolesUsuario.includes("ROLE_ADMIN"),
        iniciarSesion: (nombreUsuario, clave) =>
          apiAutenticacion.login({ userName: nombreUsuario, password: clave }),
        cerrarSesion: () => {
          localStorage.removeItem(CLAVE_TOKEN_AUTENTICACION);
          setAfirmaciones(null);
          navegar("/", { replace: true });
        },
      }}
    >
      {contenido}
    </ContextoAutenticacion.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return contexto;
}
