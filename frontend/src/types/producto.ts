export interface Product {
  id: number | string;
  nombre: string;
  precioLista: number;
  moneda?: string;
  aliadoId?: number | string | null;
  categoriaId?: number | string | null;
  imagenUrl?: string | null;
  descripcion?: string | null;
}

export interface CreateProductRequest {
  aliadoId: number;
  categoriaId?: number | null;
  nombre: string;
  descripcion?: string;
  precioLista: number;
  moneda?: string;
  incluyeIgv?: boolean;
  imagenUrl?: string;
}

export interface UpdateProductRequest {
  categoriaId?: number | null;
  nombre: string;
  descripcion?: string;
  precioLista: number;
  incluyeIgv?: boolean;
  imagenUrl?: string;
  estado?: "activo" | "inactivo";
}
