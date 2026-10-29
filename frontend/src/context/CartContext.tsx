import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types";
import { addToCart, FINANCING_CART_KEY, readCart } from "../utils/cart";

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalsByCurrency: Record<string, number>;
  addItem: (item: CartItem) => void;
  updateItem: (id: CartItem["id"], quantity: number) => void;
  removeItem: (id: CartItem["id"]) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    const syncCart = (event: StorageEvent) => {
      if (event.key === FINANCING_CART_KEY) setItems(readCart());
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  function saveItems(nextItems: CartItem[]) {
    localStorage.setItem(FINANCING_CART_KEY, JSON.stringify(nextItems));
    setItems(nextItems);
  }

  function updateItem(id: CartItem["id"], quantity: number) {
    const nextItems = readCart().map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
        : item,
    );
    saveItems(nextItems);
  }

  function removeItem(id: CartItem["id"]) {
    saveItems(readCart().filter((item) => String(item.id) !== String(id)));
  }

  const totalsByCurrency = items.reduce<Record<string, number>>(
    (totals, item) => {
      const currency = item.currency || "PEN";
      totals[currency] = (totals[currency] || 0) + item.price * item.quantity;
      return totals;
    },
    {},
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.reduce((count, item) => count + item.quantity, 0),
        totalsByCurrency,
        addItem: (item) => setItems(addToCart(item)),
        updateItem,
        removeItem,
        clearCart: () => saveItems([]),
        refreshCart: () => setItems(readCart()),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider.");
  return context;
}
