export interface Category {
  id: number | string;
  nombre: string;
}

export interface CreateCategoryRequest {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  activo?: boolean;
}
