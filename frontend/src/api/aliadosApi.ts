import type { AliadoCatalogo, AliadoPerfil } from "../types/aliado";
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "../types/producto";
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
  getMiPerfil() {
    return solicitarApi<AliadoPerfil>("/aliados/mi-perfil");
  },
  async getMisProductos() {
    return unwrapList(
      await solicitarApi<ListResponse<Product>>("/aliados/mi-perfil/productos"),
    );
  },
  createProducto(solicitudProducto: CreateProductRequest) {
    return solicitarApi<Product>("/aliados/mi-perfil/productos", {
      method: "POST",
      cuerpo: JSON.stringify(solicitudProducto),
    });
  },
  updateProducto(
    idProducto: Product["id"],
    solicitudProducto: UpdateProductRequest,
  ) {
    return solicitarApi<Product>(`/aliados/mi-perfil/productos/${idProducto}`, {
      method: "PUT",
      cuerpo: JSON.stringify(solicitudProducto),
    });
  },
  removeProducto(idProducto: Product["id"]) {
    return solicitarApi<void>(`/aliados/mi-perfil/productos/${idProducto}`, {
      method: "DELETE",
    });
  },
};
