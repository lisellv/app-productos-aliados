import { useState } from "react";
import { Link } from "react-router-dom";

interface EvaluationResult {
  resultadoPrecalificacion?: string;
  resultado?: string;
  producto?: string;
  montoSolicitado?: string | number;
  plazoMeses?: string | number;
}

function readEvaluation(): EvaluationResult {
  try {
    return JSON.parse(
      sessionStorage.getItem("tech-store-evaluation-result") || "{}",
    );
  } catch {
    return {};
  }
}

function normalizeResult(value: string) {
  const result = value.trim().toLowerCase();
  if (
    ["precalificado", "precalificada", "aprobado", "aprobada", "true"].includes(
      result,
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
    ].includes(result)
  )
    return "no_precalificado";
  return "pendiente";
}

export function EvaluationPage() {
  const [evaluation] = useState(readEvaluation);
  const query = new URLSearchParams(window.location.search);
  const result = normalizeResult(
    query.get("resultado") ||
      evaluation.resultadoPrecalificacion ||
      evaluation.resultado ||
      "",
  );
  const messages = {
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
  const [label, title, message] = messages[result];
  const product = query.get("producto") || evaluation.producto;
  const amount = query.get("monto") || evaluation.montoSolicitado;
  const term = query.get("plazo") || evaluation.plazoMeses;

  return (
    <main className="confirmation evaluation-page">
      <div className="confirmation-content evaluation-content">
        <section
          className="evaluation-result"
          data-result={result}
          aria-live="polite"
        >
          <span className="thanks-label">{label}</span>
          <h1>{title}</h1>
          <p className="confirmation-message">{message}</p>
          {(product || amount || term) && (
            <div className="evaluation-details">
              {product && <span>Producto: {product}</span>}
              {amount && <span>Monto solicitado: {amount}</span>}
              {term && <span>Plazo: {term} meses</span>}
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
