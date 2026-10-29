import { useEffect, useState } from "react";
import { apiAliados } from "../api/aliadosApi";
import { apiCategorias } from "../api/categoriasApi";
import { apiProductos } from "../api/productosApi";
import { useCart } from "../context/ContextoCarrito";
import type { AliadoCatalogo } from "../types/aliado";
import type { Category, Product } from "../types/modelos";
import { formatearMoneda } from "../utils/carrito";

function esCategoriaCreditoBancario(nombre: string): boolean {
  return (
    nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLocaleLowerCase("es") === "credito bancario"
  );
}

export function CategoriesPage() {
  const { agregarArticulo } = useCart();
  const [aliados, setAliados] = useState<AliadoCatalogo[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("all");
  const [precioMinimo, setPrecioMinimo] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [intentoCarga, setIntentoCarga] = useState(0);
  const [mensajesProducto, setMensajesProducto] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let solicitudVigente = true;
    setCargando(true);
    setMensajeError("");
    Promise.all([
      apiCategorias.getAll(),
      apiProductos.getAll(),
      apiAliados.getCatalogo().catch(() => []),
    ])
      .then(([categoriasCargadas, productosCargados, aliadosCargados]) => {
        if (!solicitudVigente) return;
        setCategorias(categoriasCargadas);
        setProductos(productosCargados);
        setAliados(aliadosCargados);
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

  const categoriasOcultas = new Set(
    categorias
      .filter((categoria) => esCategoriaCreditoBancario(categoria.nombre))
      .map((categoria) => String(categoria.id)),
  );
  const categoriasVisibles = categorias.filter(
    (categoria) => !categoriasOcultas.has(String(categoria.id)),
  );
  const productosVisibles = productos.filter((producto) => {
    const precio = Number(producto.precioLista) || 0;
    return (
      !categoriasOcultas.has(String(producto.categoriaId)) &&
      (categoriaSeleccionada === "all" ||
        String(producto.categoriaId) === categoriaSeleccionada) &&
      (precioMinimo === "" || precio >= Number(precioMinimo)) &&
      (precioMaximo === "" || precio <= Number(precioMaximo))
    );
  });

  function agregarProducto(producto: Product) {
    const claveProducto = String(producto.id);
    agregarArticulo({
      id: producto.id,
      name: producto.nombre || "Producto",
      price: Number(producto.precioLista) || 0,
      currency: producto.moneda || "PEN",
      image: producto.imagenUrl || "/img/productos/vehiculos/camion.jpg",
      quantity: 1,
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
          {categoriasVisibles.map((categoria) => (
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
            const aliado = aliados.find(
              (elemento) => String(elemento.id) === String(producto.aliadoId),
            );
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
                <p className="product-seller">
                  Vendido por {aliado?.razonSocial || "Aliado comercial"}
                </p>
                <div className="product-actions">
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
