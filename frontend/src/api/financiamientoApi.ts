import type {
  ClientRecord,
  ClientRegistrationRequest,
  CreateFinancingRequest,
  FinancingOption,
  FinancingRequest,
} from "../types/financiamiento";
import { solicitarApi } from "./clienteHttp";
import { unwrapList, type ListResponse } from "./respuestaLista";

export const apiFinanciamiento = {
  obtenerMiPerfil() {
    return solicitarApi<ClientRecord | null>("/api/clientes/mi-perfil");
  },
  async getOptions() {
    return unwrapList(
      await solicitarApi<ListResponse<FinancingOption>>(
        "/api/productos-financiamiento",
        { omitirAutenticacion: true },
      ),
    );
  },
  registerClient(datosCliente: ClientRegistrationRequest) {
    return solicitarApi<{ clienteId: number }>("/api/clientes/registro", {
      method: "POST",
      cuerpo: JSON.stringify(datosCliente),
    });
  },
  createRequest(datosSolicitud: CreateFinancingRequest) {
    return solicitarApi<FinancingRequest>("/api/solicitudes-financiamiento", {
      method: "POST",
      cuerpo: JSON.stringify(datosSolicitud),
    });
  },
  getRequests() {
    return solicitarApi<FinancingRequest[]>("/api/solicitudes-financiamiento");
  },
  getClients() {
    return solicitarApi<ClientRecord[]>("/api/clientes");
  },
};
