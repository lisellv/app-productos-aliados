import axios, { type AxiosRequestConfig } from "axios";
import clienteHttp, { URL_BASE_API } from "./instanciaAxios";

interface OpcionesSolicitud extends Omit<
  AxiosRequestConfig,
  "baseURL" | "data" | "url"
> {
  cuerpo?: unknown;
  omitirAutenticacion?: boolean;
}

// Conserva la interfaz simple de los servicios y normaliza errores HTTP.
export async function solicitarApi<T>(
  ruta: string,
  opciones: OpcionesSolicitud = {},
): Promise<T> {
  const {
    cuerpo: body,
    omitirAutenticacion = false,
    ...opcionesPeticion
  } = opciones;
  const baseIncluyeApi = URL_BASE_API.endsWith("/api");
  const rutaIncluyeApi = ruta.startsWith("/api/");
  const rutaPeticion =
    baseIncluyeApi === rutaIncluyeApi
      ? baseIncluyeApi
        ? ruta.slice(4)
        : `/api${ruta.startsWith("/") ? ruta : `/${ruta}`}`
      : ruta;
  try {
    const respuesta = await clienteHttp.request<T>({
      ...opcionesPeticion,
      url: rutaPeticion,
      data: body,
      omitirAutenticacion,
    } as AxiosRequestConfig & { omitirAutenticacion: boolean });
    if (respuesta.status === 204 || respuesta.data === "") return null as T;
    return respuesta.data;
  } catch (errorCapturado) {
    if (axios.isAxiosError(errorCapturado)) {
      if (!errorCapturado.response) {
        throw new TypeError("No se pudo conectar con el servidor.");
      }

      const cuerpoRespuesta = errorCapturado.response.data;
      if (typeof cuerpoRespuesta === "string" && cuerpoRespuesta) {
        throw new Error(cuerpoRespuesta);
      }
      if (cuerpoRespuesta && typeof cuerpoRespuesta === "object") {
        const detalles = cuerpoRespuesta as {
          message?: unknown;
          error?: unknown;
          detail?: unknown;
        };
        const mensaje = detalles.message || detalles.error || detalles.detail;
        if (typeof mensaje === "string" && mensaje) throw new Error(mensaje);
      }
      throw new Error(`Error del servidor (${errorCapturado.response.status})`);
    }
    throw errorCapturado;
  }
}
