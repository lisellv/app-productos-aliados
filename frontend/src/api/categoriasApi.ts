import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/categoria";
import { solicitarApi } from "./clienteHttp";
import { unwrapList, type ListResponse } from "./respuestaLista";

export const apiCategorias = {
  async getAll() {
    return unwrapList(
      await solicitarApi<ListResponse<Category>>("/categorias", {
        omitirAutenticacion: true,
      }),
    );
  },
  getById(idCategoria: Category["id"]) {
    return solicitarApi<Category>(`/categorias/${idCategoria}`, {
      omitirAutenticacion: true,
    });
  },
  create(solicitudCategoria: CreateCategoryRequest) {
    return solicitarApi<Category>("/categorias", {
      method: "POST",
      cuerpo: JSON.stringify(solicitudCategoria),
    });
  },
  update(
    idCategoria: Category["id"],
    solicitudCategoria: UpdateCategoryRequest,
  ) {
    return solicitarApi<Category>(`/categorias/${idCategoria}`, {
      method: "PUT",
      cuerpo: JSON.stringify(solicitudCategoria),
    });
  },
  remove(idCategoria: Category["id"]) {
    return solicitarApi<void>(`/categorias/${idCategoria}`, {
      method: "DELETE",
    });
  },
};
