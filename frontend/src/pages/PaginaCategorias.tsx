import { useEffect, useState } from "react";
import { apiCategorias } from "../api/categoriasApi";
import { apiProductos } from "../api/productosApi";
import { useCart } from "../context/ContextoCarrito";
import type { Category, Product } from "../types/modelos";
import { formatearMoneda } from "../utils/carrito";

export function CategoriesPage() {
  const { agregarArticulo } = useCart();
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("all");
  const [precioMinimo, setPrecioMinimo] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [intentoCarga, setIntentoCarga] = useState(0);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [mensajesProducto, setMensajesProducto] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let solicitudVigente = true;
    setCargando(true);
    setMensajeError("");
    Promise.all([apiCategorias.getAll(), apiProductos.getAll()])
      .then(([categoriasCargadas, productosCargados]) => {
        if (!solicitudVigente) return;
        setCategorias(categoriasCargadas);
        setProductos(productosCargados);
      })
      .catch(() => {
        if (!solicitudVigente) return;
        setMensajeError(
          "No se pudieron cargar los productos. Inténtalo más tarde.",
        );
      })
      .finally(() => {
        if (solicitudVigente) setCargando(false);
      });
    return () => {
      solicitudVigente = false;
    };
  }, [intentoCarga]);

  const productosVisibles = productos.filter((producto) => {
    const precio = Number(producto.precioLista) || 0;
    return (
      (categoriaSeleccionada === "all" ||
        String(producto.categoriaId) === categoriaSeleccionada) &&
      (precioMinimo === "" || precio >= Number(precioMinimo)) &&
      (precioMaximo === "" || precio <= Number(precioMaximo))
    );
  });

  function agregarProducto(producto: Product) {
    const claveProducto = String(producto.id);
    const cantidad = cantidades[claveProducto] || 0;
    if (cantidad < 1) {
      setMensajesProducto((anteriores) => ({
        ...anteriores,
        [claveProducto]: "Selecciona una cantidad primero.",
      }));
      return;
    }
    agregarArticulo({
      id: producto.id,
      name: producto.nombre || "Producto",
      price: Number(producto.precioLista) || 0,
      currency: producto.moneda || "PEN",
      image: producto.imagenUrl || "/img/productos/vehiculos/camion.jpg",
      quantity: cantidad,
    });
    setMensajesProducto((anteriores) => ({
      ...anteriores,
      [claveProducto]: "Agregado al carrito.",
    }));
  }

  return (
    <main className="catalog">
      <aside className="filtros" aria-label="Filtros de productos">
        <label htmlFor="filtroCategoria">Filtrar por categoría:</label>
        <select
          id="filtroCategoria"
          value={categoriaSeleccionada}
          onChange={(evento) => setCategoriaSeleccionada(evento.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="precioMinimo">Filtrar por precio:</label>
        <div className="fila-precios">
          <input
            id="precioMinimo"
            type="number"
            min="0"
            value={precioMinimo}
            onChange={(evento) => setPrecioMinimo(evento.target.value)}
            placeholder="Mín"
          />
          <span aria-hidden="true">-</span>
          <input
            type="number"
            min="0"
            value={precioMaximo}
            onChange={(evento) => setPrecioMaximo(evento.target.value)}
            placeholder="Máx"
            aria-label="Precio máximo"
          />
        </div>
      </aside>
      <section className="productos" aria-live="polite">
        {cargando && <p role="status">Cargando productos...</p>}
        {mensajeError && (
          <div role="alert">
            <p>{mensajeError}</p>
            <button
              type="button"
              className="rounded bg-secondary px-4 py-2 text-white hover:bg-primary"
              onClick={() => setIntentoCarga((intento) => intento + 1)}
            >
              Reintentar
            </button>
          </div>
        )}
        {!cargando && !mensajeError && productosVisibles.length === 0 && (
          <p>No hay productos para mostrar.</p>
        )}
        {!cargando &&
          !mensajeError &&
          productosVisibles.map((producto) => {
            const claveProducto = String(producto.id);
            const cantidad = cantidades[claveProducto] || 0;
            return (
              <article className="producto" key={claveProducto}>
                <img
                  src={
                    producto.imagenUrl || "/img/productos/vehiculos/camion.jpg"
                  }
                  alt={producto.nombre || "Producto"}
                />
                <h2>{producto.nombre || "Producto"}</h2>
                <p>
                  {formatearMoneda(
                    Number(producto.precioLista) || 0,
                    producto.moneda || "PEN",
                  )}
                </p>
                <div className="product-actions">
                  <div
                    className="cantidad"
                    aria-label={`Cantidad de ${producto.nombre}`}
                  >
                    <button
                      type="button"
                      aria-label="Reducir cantidad"
                      disabled={cantidad === 0}
                      onClick={() =>
                        setCantidades((anteriores) => ({
                          ...anteriores,
                          [claveProducto]: Math.max(0, cantidad - 1),
                        }))
                      }
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={cantidad}
                      aria-label={`Cantidad de ${producto.nombre}`}
                      onChange={(evento) =>
                        setCantidades((anteriores) => ({
                          ...anteriores,
                          [claveProducto]: Math.max(
                            0,
                            Math.floor(Number(evento.target.value) || 0),
                          ),
                        }))
                      }
                    />
                    <button
                      type="button"
                      aria-label="Aumentar cantidad"
                      onClick={() =>
                        setCantidades((anteriores) => ({
                          ...anteriores,
                          [claveProducto]: cantidad + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    type="button"
                    onClick={() => agregarProducto(producto)}
                  >
                    Agregar al carrito
                  </button>
                </div>
                <p className="product-feedback" role="status">
                  {mensajesProducto[claveProducto]}
                </p>
              </article>
            );
          })}
      </section>
    </main>
  );
}
