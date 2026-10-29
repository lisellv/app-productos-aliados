import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";
import { apiRequest } from "./client";
import { unwrapList, type ListResponse } from "./listResponse";

export const categoryApi = {
  async getAll() {
    return unwrapList(
      await apiRequest<ListResponse<Category>>("/categorias", {
        skipAuth: true,
      }),
    );
  },
  getById(id: Category["id"]) {
    return apiRequest<Category>(`/categorias/${id}`, { skipAuth: true });
  },
  create(data: CreateCategoryRequest) {
    return apiRequest<Category>("/categorias", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: Category["id"], data: UpdateCategoryRequest) {
    return apiRequest<Category>(`/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  remove(id: Category["id"]) {
    return apiRequest<void>(`/categorias/${id}`, { method: "DELETE" });
  },
};
