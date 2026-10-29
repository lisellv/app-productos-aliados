import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiAliados } from "../api/aliadosApi";
import { apiCategorias } from "../api/categoriasApi";
import { apiFinanciamiento } from "../api/financiamientoApi";
import { apiProductos } from "../api/productosApi";
import { useCart } from "../context/ContextoCarrito";
import type { AliadoCatalogo } from "../types/aliado";
import type { FinancingOption, Product } from "../types/modelos";
import { calcularTotalSolicitado, formatearMoneda } from "../utils/carrito";

function esCreditoBancario(nombre: string): boolean {
  return (
    nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLocaleLowerCase("es") === "credito bancario"
  );
}

function nombreVisibleCredito(nombre: string): string {
  return nombre.replace(/\s+S\/\s*[\d,.]+\s*$/i, "").trim();
}

export function CartPage() {
  const { articulos, totalesPorMoneda, actualizarArticulo, quitarArticulo } =
    useCart();
  const [productosCredito, setProductosCredito] = useState<Product[]>([]);
  const [aliados, setAliados] = useState<AliadoCatalogo[]>([]);
  const [opcionesFinanciamiento, setOpcionesFinanciamiento] = useState<
    FinancingOption[]
  >([]);
  const [productoCreditoId, setProductoCreditoId] = useState("");
  const [montoFinanciar, setMontoFinanciar] = useState("");
  const [cargandoCreditos, setCargandoCreditos] = useState(true);
  const [errorCreditos, setErrorCreditos] = useState("");

  useEffect(() => {
    let solicitudVigente = true;
    Promise.all([
      apiCategorias.getAll(),
      apiProductos.getAll(),
      apiAliados.getCatalogo().catch(() => []),
      apiFinanciamiento.getOptions(),
    ])
      .then(([categorias, productos, aliadosCargados, opciones]) => {
        if (!solicitudVigente) return;
        const categoriaCredito = categorias.find((categoria) =>
          esCreditoBancario(categoria.nombre),
        );
        const fechaActual = new Date().toISOString().slice(0, 10);
        const opcionesVigentes = opciones.filter(
          (opcion) =>
            opcion.activo !== false &&
            (!opcion.vigenteDesde || opcion.vigenteDesde <= fechaActual) &&
            (!opcion.vigenteHasta || opcion.vigenteHasta >= fechaActual),
        );
        const creditosDisponibles = categoriaCredito
          ? productos.filter(
              (producto) =>
                String(producto.categoriaId) === String(categoriaCredito.id) &&
                opcionesVigentes.some(
                  (opcion) => String(opcion.productoId) === String(producto.id),
                ),
            )
          : [];

        setProductosCredito(creditosDisponibles);
        setAliados(aliadosCargados);
        setOpcionesFinanciamiento(opcionesVigentes);
        setErrorCreditos("");
      })
      .catch(() => {
        if (solicitudVigente) {
          setErrorCreditos(
            "No se pudieron cargar las opciones de crédito bancario.",
          );
        }
      })
      .finally(() => {
        if (solicitudVigente) setCargandoCreditos(false);
      });

    return () => {
      solicitudVigente = false;
    };
  }, []);

  const productoCreditoSeleccionado = productosCredito.find(
    (producto) => String(producto.id) === productoCreditoId,
  );
  const opcionCreditoSeleccionada = opcionesFinanciamiento.find(
    (opcion) =>
      String(opcion.productoId) === String(productoCreditoSeleccionado?.id),
  );
  const aliadoCreditoSeleccionado = aliados.find(
    (aliado) =>
      String(aliado.id) === String(productoCreditoSeleccionado?.aliadoId),
  );
  const totalesProductos = useMemo(
    () =>
      Object.entries(totalesPorMoneda)
        .map(([moneda, importe]) => formatearMoneda(importe, moneda))
        .join(" · ") || formatearMoneda(0),
    [totalesPorMoneda],
  );
  const subtotalProductosNumerico = Object.values(totalesPorMoneda).reduce(
    (subtotal, importe) => subtotal + importe,
    0,
  );
  const montoNumerico = Number(montoFinanciar);
  const montoValido = Boolean(
    opcionCreditoSeleccionada &&
    Number.isFinite(montoNumerico) &&
    montoNumerico >= Number(opcionCreditoSeleccionada.montoMinimo) &&
    montoNumerico <= Number(opcionCreditoSeleccionada.montoMaximo),
  );
  const totalSolicitado = montoValido
    ? calcularTotalSolicitado(subtotalProductosNumerico, montoNumerico)
    : null;

  function seleccionarCredito(producto: Product) {
    setProductoCreditoId(String(producto.id));
    const opcion = opcionesFinanciamiento.find(
      (elemento) => String(elemento.productoId) === String(producto.id),
    );
    if (!opcion) {
      setMontoFinanciar("");
      return;
    }
    const montoSugerido = Number(producto.precioLista) || 0;
    setMontoFinanciar(
      Math.min(
        Number(opcion.montoMaximo),
        Math.max(Number(opcion.montoMinimo), montoSugerido),
      ).toFixed(2),
    );
  }

  return (
    <main className="shopping-wrap">
      <h1 className="cart-title">Ver productos a financiar</h1>
      <div className="cart-workflow">
        <section
          className="cart-workflow-section"
          aria-labelledby="productosTitulo"
        >
          <div className="cart-section-heading">
            <h2 id="productosTitulo">Productos que deseas financiar</h2>
            <span>{articulos.length} productos</span>
          </div>
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
                            actualizarArticulo(
                              articulo.id,
                              articulo.quantity - 1,
                            )
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
                            actualizarArticulo(
                              articulo.id,
                              articulo.quantity + 1,
                            )
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
          <div className="cart-subtotal">
            <span>Subtotal de productos</span>
            <strong>{totalesProductos}</strong>
          </div>
        </section>

        <section
          className="cart-workflow-section"
          aria-labelledby="creditoTitulo"
        >
          <div className="cart-section-heading">
            <h2 id="creditoTitulo">Selecciona un crédito bancario</h2>
          </div>
          {cargandoCreditos && <p role="status">Cargando créditos...</p>}
          {errorCreditos && <p role="alert">{errorCreditos}</p>}
          {!cargandoCreditos &&
            !errorCreditos &&
            productosCredito.length === 0 && (
              <p>No hay créditos bancarios disponibles en este momento.</p>
            )}
          <div className="credit-product-list">
            {productosCredito.map((producto) => {
              const opcion = opcionesFinanciamiento.find(
                (elemento) =>
                  String(elemento.productoId) === String(producto.id),
              );
              const aliado = aliados.find(
                (elemento) => String(elemento.id) === String(producto.aliadoId),
              );
              const seleccionado = String(producto.id) === productoCreditoId;

              return (
                <label
                  className={`credit-product-option${seleccionado ? " selected" : ""}`}
                  key={producto.id}
                >
                  <input
                    type="radio"
                    name="productoCredito"
                    value={producto.id}
                    checked={seleccionado}
                    onChange={() => seleccionarCredito(producto)}
                  />
                  <span className="credit-product-option-copy">
                    <strong>{nombreVisibleCredito(producto.nombre)}</strong>
                    <span>{aliado?.razonSocial || "Entidad financiera"}</span>
                    {opcion && (
                      <span>
                        Monto disponible:{" "}
                        {formatearMoneda(
                          Number(opcion.montoMinimo),
                          producto.moneda || "PEN",
                        )}{" "}
                        a{" "}
                        {formatearMoneda(
                          Number(opcion.montoMaximo),
                          producto.moneda || "PEN",
                        )}
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          {productoCreditoSeleccionado && opcionCreditoSeleccionada && (
            <label className="credit-amount-field">
              Monto a financiar (S/)
              <input
                type="number"
                min={opcionCreditoSeleccionada.montoMinimo}
                max={opcionCreditoSeleccionada.montoMaximo}
                step="0.01"
                value={montoFinanciar}
                onChange={(evento) => setMontoFinanciar(evento.target.value)}
                required
              />
            </label>
          )}
        </section>

        <section
          className="cart-workflow-section"
          aria-labelledby="tasaCreditoTitulo"
        >
          <div className="cart-section-heading">
            <h2 id="tasaCreditoTitulo">Tasa del crédito bancario</h2>
          </div>
          {opcionCreditoSeleccionada ? (
            <div className="credit-rate-panel" aria-live="polite">
              <span>
                {opcionCreditoSeleccionada.tipoTasa === "TEA"
                  ? "Tasa efectiva anual (TEA)"
                  : opcionCreditoSeleccionada.tipoTasa === "TNA"
                    ? "Tasa nominal anual (TNA)"
                    : `Tipo de tasa (${opcionCreditoSeleccionada.tipoTasa})`}
              </span>
              <strong>
                {Number(opcionCreditoSeleccionada.tasaAnual).toFixed(2)}% anual
              </strong>
            </div>
          ) : (
            <p>Selecciona un crédito bancario para consultar su tasa anual.</p>
          )}
        </section>

        <section
          className="cart-summary-section"
          aria-labelledby="resumenTitulo"
        >
          <h2 id="resumenTitulo">Resumen de la solicitud</h2>
          <div className="cart-summary-line">
            <span>Subtotal de productos</span>
            <span>{totalesProductos}</span>
          </div>
          <div className="cart-summary-line">
            <span>Monto a financiar</span>
            <span>
              {productoCreditoSeleccionado
                ? formatearMoneda(
                    montoNumerico || 0,
                    productoCreditoSeleccionado.moneda || "PEN",
                  )
                : "Selecciona un crédito"}
            </span>
          </div>
          <div className="total-row">
            <span>Total solicitado</span>
            <strong>
              {totalSolicitado === null
                ? "—"
                : formatearMoneda(
                    totalSolicitado,
                    productoCreditoSeleccionado?.moneda || "PEN",
                  )}
            </strong>
          </div>
          <Link
            to="/requests/new"
            state={{
              productoCreditoId: productoCreditoSeleccionado?.id,
              montoFinanciar: montoValido ? montoNumerico : null,
              creditoSeleccionado:
                productoCreditoSeleccionado &&
                opcionCreditoSeleccionada &&
                montoValido
                  ? {
                      nombre: nombreVisibleCredito(
                        productoCreditoSeleccionado.nombre,
                      ),
                      entidad:
                        aliadoCreditoSeleccionado?.razonSocial ||
                        "Entidad financiera",
                      monto: montoNumerico,
                      moneda: productoCreditoSeleccionado.moneda || "PEN",
                      tipoTasa: opcionCreditoSeleccionada.tipoTasa,
                      tasaAnual: opcionCreditoSeleccionada.tasaAnual,
                      plazoMinimoMeses:
                        opcionCreditoSeleccionada.plazoMinimoMeses,
                      plazoMaximoMeses:
                        opcionCreditoSeleccionada.plazoMaximoMeses,
                    }
                  : null,
            }}
            className={`confirm-btn${articulos.length && montoValido ? "" : " is-disabled"}`}
            aria-disabled={!articulos.length || !montoValido}
            onClick={(evento) => {
              if (!articulos.length || !montoValido) evento.preventDefault();
            }}
          >
            Registrar solicitud
          </Link>
        </section>
      </div>
    </main>
  );
}
