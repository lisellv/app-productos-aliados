import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "../types/producto";
import { solicitarApi } from "./clienteHttp";
import { unwrapList, type ListResponse } from "./respuestaLista";

export const apiProductos = {
  async getAll() {
    return unwrapList(
      await solicitarApi<ListResponse<Product>>("/productos", {
        omitirAutenticacion: true,
      }),
    );
  },
  getById(idProducto: Product["id"]) {
    return solicitarApi<Product>(`/productos/${idProducto}`, {
      omitirAutenticacion: true,
    });
  },
  create(solicitudProducto: CreateProductRequest) {
    return solicitarApi<Product>("/productos", {
      method: "POST",
      cuerpo: JSON.stringify(solicitudProducto),
    });
  },
  update(idProducto: Product["id"], solicitudProducto: UpdateProductRequest) {
    return solicitarApi<Product>(`/productos/${idProducto}`, {
      method: "PUT",
      cuerpo: JSON.stringify(solicitudProducto),
    });
  },
  remove(idProducto: Product["id"]) {
    return solicitarApi<void>(`/productos/${idProducto}`, { method: "DELETE" });
  },
};
