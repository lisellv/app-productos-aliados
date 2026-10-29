import type {
  ClientRecord,
  ClientRegistrationRequest,
  CreateFinancingRequest,
  FinancingOption,
  FinancingRequest,
} from "../types/financing";
import { apiRequest } from "./client";
import { unwrapList, type ListResponse } from "./listResponse";

export const financingApi = {
  async getOptions() {
    return unwrapList(
      await apiRequest<ListResponse<FinancingOption>>(
        "/api/productos-financiamiento",
        { skipAuth: true },
      ),
    );
  },
  registerClient(data: ClientRegistrationRequest) {
    return apiRequest<{ clienteId: number }>("/api/clientes/registro", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify(data),
    });
  },
  createRequest(data: CreateFinancingRequest) {
    return apiRequest<FinancingRequest>("/api/solicitudes-financiamiento", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getRequests() {
    return apiRequest<FinancingRequest[]>("/api/solicitudes-financiamiento");
  },
  getClients() {
    return apiRequest<ClientRecord[]>("/api/clientes");
  },
};
