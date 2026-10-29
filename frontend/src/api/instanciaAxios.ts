import axios, { type InternalAxiosRequestConfig } from "axios";

export const URL_BASE_API = (
  import.meta.env.VITE_API_URL ||
  window.__ENV__?.API_BASE_URL ||
  "/api"
).replace(/\/+$/, "");

export const CLAVE_TOKEN_AUTENTICACION = "tech-store-auth-token";

const clienteHttp = axios.create({
  baseURL: URL_BASE_API,
  headers: { Accept: "application/json" },
});

clienteHttp.interceptors.request.use((configuracion) => {
  const configuracionPeticion = configuracion as InternalAxiosRequestConfig & {
    omitirAutenticacion?: boolean;
  };
  if (!configuracionPeticion.omitirAutenticacion) {
    const tokenJwt = localStorage.getItem(CLAVE_TOKEN_AUTENTICACION);
    if (tokenJwt)
      configuracionPeticion.headers.set("Authorization", `Bearer ${tokenJwt}`);
  }
  if (
    configuracionPeticion.data !== undefined &&
    !configuracionPeticion.headers.has("Content-Type")
  ) {
    configuracionPeticion.headers.set("Content-Type", "application/json");
  }
  delete configuracionPeticion.omitirAutenticacion;
  return configuracionPeticion;
});

clienteHttp.interceptors.response.use(
  (respuesta) => respuesta,
  (errorCapturado: unknown) => {
    if (
      axios.isAxiosError(errorCapturado) &&
      errorCapturado.response?.status === 401
    ) {
      localStorage.removeItem(CLAVE_TOKEN_AUTENTICACION);
      window.dispatchEvent(new Event("authchange"));
    }
    return Promise.reject(errorCapturado);
  },
);

export default clienteHttp;
