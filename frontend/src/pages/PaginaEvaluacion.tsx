import { useState } from "react";
import { Link } from "react-router-dom";
import { formatearMoneda } from "../utils/carrito";

interface ProductoEvaluado {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  moneda: string;
}

interface CreditoEvaluado {
  nombre: string;
  entidad: string;
  monto: number;
  moneda: string;
  tipoTasa: string;
  tasaAnual: number;
  plazoMinimoMeses: number;
  plazoMaximoMeses: number;
}

interface ResumenSolicitud {
  productos: ProductoEvaluado[];
  subtotalPorMoneda: Record<string, number>;
  creditoSeleccionado: CreditoEvaluado | null;
  totalSolicitado: number;
  moneda: string;
}

interface ResultadoEvaluacion {
  resultadoPrecalificacion?: string;
  resultado?: string;
  resultadoSimulado?: boolean;
  producto?: string;
  montoSolicitado?: string | number;
  plazoMeses?: string | number;
  resumenSolicitud?: ResumenSolicitud;
}

function leerResultadoEvaluacion(): ResultadoEvaluacion {
  try {
    return JSON.parse(
      sessionStorage.getItem("tech-store-evaluation-result") || "{}",
    );
  } catch {
    return {};
  }
}

function normalizarResultado(valor: string) {
  const resultado = valor.trim().toLowerCase();
  if (
    ["precalificado", "precalificada", "aprobado", "aprobada", "true"].includes(
      resultado,
    )
  )
    return "precalificado";
  if (
    [
      "no_precalificado",
      "no precalificado",
      "rechazado",
      "rechazada",
      "false",
    ].includes(resultado)
  )
    return "no_precalificado";
  return "pendiente";
}

export function EvaluationPage() {
  const [resultadoEvaluacion] = useState(leerResultadoEvaluacion);
  const parametros = new URLSearchParams(window.location.search);
  const resultado = normalizarResultado(
    parametros.get("resultado") ||
      resultadoEvaluacion.resultadoPrecalificacion ||
      resultadoEvaluacion.resultado ||
      "",
  );
  const mensajes = {
    precalificado: [
      "Precalificación favorable",
      "Sí, cumples las condiciones iniciales",
      "Puedes continuar con tu solicitud. La aprobación final depende de la evaluación de la entidad financiera.",
    ],
    no_precalificado: [
      "Resultado de precalificación",
      "Por ahora, no cumples las condiciones iniciales",
      "No derivaremos esta solicitud a una entidad financiera. Puedes consultar con nuestros canales de atención sobre otras alternativas.",
    ],
    pendiente: [
      "Resultado de evaluación",
      "Aún no hay un resultado disponible",
      "No encontramos el resultado de una evaluación asociada a esta solicitud.",
    ],
  } as const;
  const [etiqueta, titulo, mensaje] = mensajes[resultado];
  const producto = parametros.get("producto") || resultadoEvaluacion.producto;
  const monto = parametros.get("monto") || resultadoEvaluacion.montoSolicitado;
  const plazo = parametros.get("plazo") || resultadoEvaluacion.plazoMeses;
  const resumenSolicitud = resultadoEvaluacion.resumenSolicitud;
  const subtotalFormateado = Object.entries(
    resumenSolicitud?.subtotalPorMoneda || {},
  )
    .map(([moneda, importe]) => formatearMoneda(importe, moneda))
    .join(" · ");

  return (
    <main className="confirmation evaluation-page">
      <div className="confirmation-content evaluation-content">
        <section
          className="evaluation-result"
          data-result={resultado}
          aria-live="polite"
        >
          <span className="thanks-label">{etiqueta}</span>
          <h1>{titulo}</h1>
          <p className="confirmation-message">{mensaje}</p>
          {resultadoEvaluacion.resultadoSimulado && (
            <p className="evaluation-simulation-note" role="note">
              Resultado aleatorio de demostración; no representa una aprobación
              real de crédito.
            </p>
          )}
          {resumenSolicitud && (
            <section className="evaluation-request-summary">
              <h2>Resumen de la solicitud</h2>
              <div className="evaluation-summary-products">
                {resumenSolicitud.productos.map((articulo) => (
                  <div
                    className="evaluation-summary-product"
                    key={`${articulo.nombre}-${articulo.moneda}`}
                  >
                    <div>
                      <span>
                        {articulo.nombre}
                        {articulo.cantidad > 1 && ` × ${articulo.cantidad}`}
                      </span>
                      <small>
                        Precio unitario:{" "}
                        {formatearMoneda(
                          articulo.precioUnitario,
                          articulo.moneda,
                        )}
                      </small>
                    </div>
                    <strong>
                      {formatearMoneda(articulo.subtotal, articulo.moneda)}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="evaluation-summary-line">
                <span>Subtotal de productos</span>
                <strong>{subtotalFormateado || formatearMoneda(0)}</strong>
              </div>
              {resumenSolicitud.creditoSeleccionado && (
                <div className="evaluation-summary-credit">
                  <strong>Crédito bancario</strong>
                  <span>
                    {resumenSolicitud.creditoSeleccionado.nombre} ·{" "}
                    {resumenSolicitud.creditoSeleccionado.entidad}
                  </span>
                  <span>
                    Monto a financiar:{" "}
                    {formatearMoneda(
                      resumenSolicitud.creditoSeleccionado.monto,
                      resumenSolicitud.creditoSeleccionado.moneda,
                    )}
                  </span>
                  <span>
                    {resumenSolicitud.creditoSeleccionado.tipoTasa}:{" "}
                    {Number(
                      resumenSolicitud.creditoSeleccionado.tasaAnual,
                    ).toFixed(2)}
                    % anual · plazo disponible:{" "}
                    {resumenSolicitud.creditoSeleccionado.plazoMinimoMeses} a{" "}
                    {resumenSolicitud.creditoSeleccionado.plazoMaximoMeses}{" "}
                    meses
                  </span>
                </div>
              )}
              <div className="evaluation-summary-total">
                <span>Total solicitado</span>
                <strong>
                  {formatearMoneda(
                    resumenSolicitud.totalSolicitado,
                    resumenSolicitud.moneda,
                  )}
                </strong>
              </div>
            </section>
          )}
          {!resumenSolicitud && (producto || monto || plazo) && (
            <div className="evaluation-details">
              {producto && <span>Producto: {producto}</span>}
              {monto && <span>Monto solicitado: {monto}</span>}
              {plazo && <span>Plazo: {plazo} meses</span>}
            </div>
          )}
        </section>
        <section className="attention-channels">
          <h2>Canales de atención</h2>
          <div className="attention-channel-list">
            <article>
              <h3>Asesoría del aliado comercial</h3>
              <p>
                El banco se comunicará contigo para iniciar la evaluación de tu
                solicitud y coordinar el proceso de desembolso.
              </p>
            </article>
            <article>
              <h3>Canales digitales</h3>
              <p>
                <Link to="/#contacto">Contáctanos, Facebook e Instagram</Link>.
              </p>
            </article>
          </div>
        </section>
        <Link className="confirm-btn evaluation-back-link" to="/products">
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
}
