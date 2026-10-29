import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "../types/product";
import { apiRequest } from "./client";
import { unwrapList, type ListResponse } from "./listResponse";

export const productApi = {
  async getAll() {
    return unwrapList(
      await apiRequest<ListResponse<Product>>("/productos", {
        skipAuth: true,
      }),
    );
  },
  getById(id: Product["id"]) {
    return apiRequest<Product>(`/productos/${id}`, { skipAuth: true });
  },
  create(data: CreateProductRequest) {
    return apiRequest<Product>("/productos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: Product["id"], data: UpdateProductRequest) {
    return apiRequest<Product>(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  remove(id: Product["id"]) {
    return apiRequest<void>(`/productos/${id}`, { method: "DELETE" });
  },
};
