import { Link } from "react-router-dom";
import { useCart } from "../context/ContextoCarrito";
import { formatearMoneda } from "../utils/carrito";

export function CartPage() {
  const { articulos, totalesPorMoneda, actualizarArticulo, quitarArticulo } =
    useCart();

  return (
    <main className="shopping-wrap">
      <h1 className="cart-title">Ver productos a financiar</h1>
      <section className="cart-panel" aria-label="Productos seleccionados">
        <div className="cart-items" aria-live="polite">
          {articulos.length === 0 && (
            <p className="cart-empty">Aún no agregaste productos.</p>
          )}
          {articulos.map((articulo) => (
            <article className="cart-item" key={articulo.id}>
              <div className="product-box">
                <div className="product-thumb">
                  <img src={articulo.image} alt={articulo.name} />
                </div>
                <div className="product-meta">
                  <div className="product-name">{articulo.name}</div>
                  <div className="product-row">
                    <span className="price">
                      {formatearMoneda(articulo.price, articulo.currency)}
                    </span>
                    <div
                      className="quantity"
                      aria-label={`Cantidad de ${articulo.name}`}
                    >
                      <button
                        type="button"
                        aria-label="Reducir cantidad"
                        disabled={articulo.quantity <= 1}
                        onClick={() =>
                          actualizarArticulo(articulo.id, articulo.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={articulo.quantity}
                        aria-label={`Cantidad de ${articulo.name}`}
                        onChange={(evento) =>
                          actualizarArticulo(
                            articulo.id,
                            Math.max(
                              1,
                              Math.floor(Number(evento.target.value) || 1),
                            ),
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label="Aumentar cantidad"
                        onClick={() =>
                          actualizarArticulo(articulo.id, articulo.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="cart-remove-btn"
                type="button"
                onClick={() => quitarArticulo(articulo.id)}
              >
                Eliminar
              </button>
            </article>
          ))}
        </div>
        <div className="total-row">
          <span>Total</span>
          <span>
            {Object.entries(totalesPorMoneda)
              .map(([moneda, importe]) => formatearMoneda(importe, moneda))
              .join(" · ") || formatearMoneda(0)}
          </span>
        </div>
        <Link
          to="/requests/new"
          className={`confirm-btn${articulos.length ? "" : " is-disabled"}`}
          aria-disabled={!articulos.length}
          onClick={(event) => {
            if (!articulos.length) event.preventDefault();
          }}
        >
          Registrar solicitud
        </Link>
      </section>
    </main>
  );
}
