import type { LoginRequest } from "../types/autenticacion";
import { solicitarApi } from "./clienteHttp";
import { CLAVE_TOKEN_AUTENTICACION } from "./instanciaAxios";

interface RespuestaTokenAutenticacion {
  token?: string;
  accessToken?: string;
  jwt?: string;
}

export const apiAutenticacion = {
  async login(solicitud: LoginRequest): Promise<void> {
    const respuesta = await solicitarApi<string | RespuestaTokenAutenticacion>(
      "/api/auth/login",
      {
        method: "POST",
        omitirAutenticacion: true,
        cuerpo: JSON.stringify(solicitud),
      },
    );
    const tokenJwt =
      typeof respuesta === "string"
        ? respuesta
        : respuesta.token || respuesta.accessToken || respuesta.jwt;
    if (!tokenJwt) {
      throw new Error("La respuesta de autenticación no contiene un JWT.");
    }
    localStorage.setItem(CLAVE_TOKEN_AUTENTICACION, tokenJwt);
    window.dispatchEvent(new Event("authchange"));
  },
};
