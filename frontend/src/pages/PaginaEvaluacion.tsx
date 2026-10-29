import { useState } from "react";
import { Link } from "react-router-dom";

interface ResultadoEvaluacion {
  resultadoPrecalificacion?: string;
  resultado?: string;
  producto?: string;
  montoSolicitado?: string | number;
  plazoMeses?: string | number;
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
          {(producto || monto || plazo) && (
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
                Comunícate con el aliado del producto para consultar
                alternativas y resolver tus dudas.
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
