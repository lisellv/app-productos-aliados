import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/cart";

export function CartPage() {
  const { items, totalsByCurrency, updateItem, removeItem } = useCart();

  return (
    <main className="shopping-wrap">
      <h1 className="cart-title">Ver productos a financiar</h1>
      <section className="cart-panel" aria-label="Productos seleccionados">
        <div className="cart-items" aria-live="polite">
          {items.length === 0 && (
            <p className="cart-empty">Aún no agregaste productos.</p>
          )}
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="product-box">
                <div className="product-thumb">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-meta">
                  <div className="product-name">{item.name}</div>
                  <div className="product-row">
                    <span className="price">
                      {formatMoney(item.price, item.currency)}
                    </span>
                    <div
                      className="quantity"
                      aria-label={`Cantidad de ${item.name}`}
                    >
                      <button
                        type="button"
                        aria-label="Reducir cantidad"
                        disabled={item.quantity <= 1}
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        aria-label={`Cantidad de ${item.name}`}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            Math.max(
                              1,
                              Math.floor(Number(event.target.value) || 1),
                            ),
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label="Aumentar cantidad"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
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
                onClick={() => removeItem(item.id)}
              >
                Eliminar
              </button>
            </article>
          ))}
        </div>
        <div className="total-row">
          <span>Total</span>
          <span>
            {Object.entries(totalsByCurrency)
              .map(([currency, total]) => formatMoney(total, currency))
              .join(" · ") || formatMoney(0)}
          </span>
        </div>
        <Link
          to="/requests/new"
          className={`confirm-btn${items.length ? "" : " is-disabled"}`}
          aria-disabled={!items.length}
          onClick={(event) => {
            if (!items.length) event.preventDefault();
          }}
        >
          Registrar solicitud
        </Link>
      </section>
    </main>
  );
}
