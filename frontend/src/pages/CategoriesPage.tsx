import { useEffect, useState } from "react";
import { categoryApi } from "../api/categoryApi";
import { productApi } from "../api/productApi";
import { useCart } from "../context/CartContext";
import type { Category, Product } from "../types";
import { formatMoney } from "../utils/cart";

export function CategoriesPage() {
  const { addItem } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState("all");
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([categoryApi.getAll(), productApi.getAll()])
      .then(([loadedCategories, loadedProducts]) => {
        if (!active) return;
        setCategories(loadedCategories);
        setProducts(loadedProducts);
      })
      .catch(() => {
        if (!active) return;
        setError("No se pudieron cargar los productos. Inténtalo más tarde.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const visibleProducts = products.filter((product) => {
    const price = Number(product.precioLista) || 0;
    return (
      (categoryId === "all" || String(product.categoriaId) === categoryId) &&
      (minimum === "" || price >= Number(minimum)) &&
      (maximum === "" || price <= Number(maximum))
    );
  });

  function addProduct(product: Product) {
    const key = String(product.id);
    const quantity = quantities[key] || 0;
    if (quantity < 1) {
      setFeedback((previous) => ({
        ...previous,
        [key]: "Selecciona una cantidad primero.",
      }));
      return;
    }
    addItem({
      id: product.id,
      name: product.nombre || "Producto",
      price: Number(product.precioLista) || 0,
      currency: product.moneda || "PEN",
      image: product.imagenUrl || "/img/productos/vehiculos/camion.jpg",
      quantity,
    });
    setFeedback((previous) => ({ ...previous, [key]: "Agregado al carrito." }));
  }

  return (
    <main className="catalog">
      <aside className="filtros" aria-label="Filtros de productos">
        <label htmlFor="categoryFilter">Filtrar por categoría:</label>
        <select
          id="categoryFilter"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="minPrice">Filtrar por precio:</label>
        <div className="fila-precios">
          <input
            id="minPrice"
            type="number"
            min="0"
            value={minimum}
            onChange={(event) => setMinimum(event.target.value)}
            placeholder="Mín"
          />
          <span aria-hidden="true">-</span>
          <input
            type="number"
            min="0"
            value={maximum}
            onChange={(event) => setMaximum(event.target.value)}
            placeholder="Máx"
            aria-label="Precio máximo"
          />
        </div>
      </aside>
      <section className="productos" aria-live="polite">
        {loading && <p role="status">Cargando productos...</p>}
        {error && (
          <div role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="rounded bg-secondary px-4 py-2 text-white hover:bg-primary"
              onClick={() => setLoadAttempt((attempt) => attempt + 1)}
            >
              Reintentar
            </button>
          </div>
        )}
        {!loading && !error && visibleProducts.length === 0 && (
          <p>No hay productos para mostrar.</p>
        )}
        {!loading &&
          !error &&
          visibleProducts.map((product) => {
            const key = String(product.id);
            const quantity = quantities[key] || 0;
            return (
              <article className="producto" key={key}>
                <img
                  src={
                    product.imagenUrl || "/img/productos/vehiculos/camion.jpg"
                  }
                  alt={product.nombre || "Producto"}
                />
                <h2>{product.nombre || "Producto"}</h2>
                <p>
                  {formatMoney(
                    Number(product.precioLista) || 0,
                    product.moneda || "PEN",
                  )}
                </p>
                <div className="product-actions">
                  <div
                    className="cantidad"
                    aria-label={`Cantidad de ${product.nombre}`}
                  >
                    <button
                      type="button"
                      aria-label="Reducir cantidad"
                      disabled={quantity === 0}
                      onClick={() =>
                        setQuantities((previous) => ({
                          ...previous,
                          [key]: Math.max(0, quantity - 1),
                        }))
                      }
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={quantity}
                      aria-label={`Cantidad de ${product.nombre}`}
                      onChange={(event) =>
                        setQuantities((previous) => ({
                          ...previous,
                          [key]: Math.max(
                            0,
                            Math.floor(Number(event.target.value) || 0),
                          ),
                        }))
                      }
                    />
                    <button
                      type="button"
                      aria-label="Aumentar cantidad"
                      onClick={() =>
                        setQuantities((previous) => ({
                          ...previous,
                          [key]: quantity + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    type="button"
                    onClick={() => addProduct(product)}
                  >
                    Agregar al carrito
                  </button>
                </div>
                <p className="product-feedback" role="status">
                  {feedback[key]}
                </p>
              </article>
            );
          })}
      </section>
    </main>
  );
}
