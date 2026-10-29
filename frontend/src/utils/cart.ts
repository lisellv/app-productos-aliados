import type { CartItem } from "../types";

export const FINANCING_CART_KEY = "tech-store-financing-cart";
const FALLBACK_IMAGE = "/img/productos/vehiculos/camion.jpg";

export function readCart(): CartItem[] {
  try {
    const items: unknown = JSON.parse(
      localStorage.getItem(FINANCING_CART_KEY) || "[]",
    );
    return Array.isArray(items) ? (items as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function addToCart(product: CartItem): CartItem[] {
  const items = readCart();
  const existing = items.find((item) => String(item.id) === String(product.id));
  if (existing) existing.quantity += product.quantity;
  else items.push({ ...product, image: product.image || FALLBACK_IMAGE });
  localStorage.setItem(FINANCING_CART_KEY, JSON.stringify(items));
  return items;
}

export function formatMoney(amount: number, currency = "PEN"): string {
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
