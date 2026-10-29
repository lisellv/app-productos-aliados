import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types/modelos";
import {
  agregarAlCarrito,
  CLAVE_CARRITO_FINANCIAMIENTO,
  leerCarrito,
} from "../utils/carrito";

interface EstadoCarrito {
  articulos: CartItem[];
  cantidadArticulos: number;
  totalesPorMoneda: Record<string, number>;
  agregarArticulo: (articulo: CartItem) => void;
  actualizarArticulo: (idArticulo: CartItem["id"], cantidad: number) => void;
  quitarArticulo: (idArticulo: CartItem["id"]) => void;
  vaciarCarrito: () => void;
  actualizarCarrito: () => void;
}

const ContextoCarrito = createContext<EstadoCarrito | null>(null);

export function CartProvider({ children: contenido }: { children: ReactNode }) {
  const [articulos, setArticulos] = useState(leerCarrito);

  useEffect(() => {
    const sincronizarCarrito = (evento: StorageEvent) => {
      if (evento.key === CLAVE_CARRITO_FINANCIAMIENTO)
        setArticulos(leerCarrito());
    };
    window.addEventListener("storage", sincronizarCarrito);
    return () => window.removeEventListener("storage", sincronizarCarrito);
  }, []);

  function guardarArticulos(siguientesArticulos: CartItem[]) {
    localStorage.setItem(
      CLAVE_CARRITO_FINANCIAMIENTO,
      JSON.stringify(siguientesArticulos),
    );
    setArticulos(siguientesArticulos);
  }

  function actualizarArticulo(idArticulo: CartItem["id"], cantidad: number) {
    const siguientesArticulos = leerCarrito().map((articulo) =>
      String(articulo.id) === String(idArticulo)
        ? { ...articulo, quantity: Math.max(1, Math.floor(cantidad)) }
        : articulo,
    );
    guardarArticulos(siguientesArticulos);
  }

  function quitarArticulo(idArticulo: CartItem["id"]) {
    guardarArticulos(
      leerCarrito().filter(
        (articulo) => String(articulo.id) !== String(idArticulo),
      ),
    );
  }

  const totalesPorMoneda = articulos.reduce<Record<string, number>>(
    (totales, articulo) => {
      const moneda = articulo.currency || "PEN";
      totales[moneda] =
        (totales[moneda] || 0) + articulo.price * articulo.quantity;
      return totales;
    },
    {},
  );

  return (
    <ContextoCarrito.Provider
      value={{
        articulos,
        cantidadArticulos: articulos.reduce(
          (cantidadAcumulada, articulo) =>
            cantidadAcumulada + articulo.quantity,
          0,
        ),
        totalesPorMoneda,
        agregarArticulo: (articulo) => setArticulos(agregarAlCarrito(articulo)),
        actualizarArticulo,
        quitarArticulo,
        vaciarCarrito: () => guardarArticulos([]),
        actualizarCarrito: () => setArticulos(leerCarrito()),
      }}
    >
      {contenido}
    </ContextoCarrito.Provider>
  );
}

export function useCart() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) throw new Error("useCart debe usarse dentro de CartProvider.");
  return contexto;
}
