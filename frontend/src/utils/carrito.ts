import type { CartItem } from "../types/modelos";

export const CLAVE_CARRITO_FINANCIAMIENTO = "tech-store-financing-cart";
const IMAGEN_ALTERNATIVA = "/img/productos/vehiculos/camion.jpg";

export function leerCarrito(): CartItem[] {
  try {
    const articulos: unknown = JSON.parse(
      localStorage.getItem(CLAVE_CARRITO_FINANCIAMIENTO) || "[]",
    );
    return Array.isArray(articulos) ? (articulos as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function agregarAlCarrito(producto: CartItem): CartItem[] {
  const articulos = leerCarrito();
  const existente = articulos.find(
    (articulo) => String(articulo.id) === String(producto.id),
  );
  if (existente) existente.quantity += producto.quantity;
  else
    articulos.push({
      ...producto,
      image: producto.image || IMAGEN_ALTERNATIVA,
    });
  localStorage.setItem(CLAVE_CARRITO_FINANCIAMIENTO, JSON.stringify(articulos));
  return articulos;
}

export function formatearMoneda(monto: number, moneda = "PEN"): string {
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: moneda,
    }).format(monto);
  } catch {
    return `${moneda} ${monto.toFixed(2)}`;
  }
}

export function calcularTotalSolicitado(
  subtotalProductos: number,
  montoCredito: number,
): number {
  return subtotalProductos > montoCredito
    ? subtotalProductos + montoCredito
    : montoCredito;
}
