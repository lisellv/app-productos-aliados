import type { AliadoCatalogo } from "../types/aliado";
import { solicitarApi } from "./clienteHttp";
import { unwrapList, type ListResponse } from "./respuestaLista";

export const apiAliados = {
  async getCatalogo() {
    return unwrapList(
      await solicitarApi<ListResponse<AliadoCatalogo>>("/aliados/catalogo", {
        omitirAutenticacion: true,
      }),
    );
  },
};
