const RESULT_STORAGE_KEY = "tech-store-evaluation-result";

function readEvaluation() {
  try {
    const stored = JSON.parse(
      sessionStorage.getItem(RESULT_STORAGE_KEY) || "{}",
    );
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return {};
  }
}

function normalizeResult(value) {
  const result = String(value ?? "")
    .trim()
    .toLowerCase();
  if (
    ["precalificado", "precalificada", "aprobado", "aprobada", "true"].includes(
      result,
    )
  ) {
    return "precalificado";
  }
  if (
    [
      "no_precalificado",
      "no precalificado",
      "rechazado",
      "rechazada",
      "false",
    ].includes(result)
  ) {
    return "no_precalificado";
  }
  return "pendiente";
}

function showEvaluationResult() {
  const query = new URLSearchParams(window.location.search);
  const evaluation = readEvaluation();
  const result = normalizeResult(
    query.get("resultado") ||
      evaluation.resultadoPrecalificacion ||
      evaluation.resultado,
  );
  const resultPanel = document.getElementById("evaluationResult");
  const label = document.getElementById("evaluationLabel");
  const title = document.getElementById("evaluationTitle");
  const message = document.getElementById("evaluationMessage");

  resultPanel.dataset.result = result;

  if (result === "precalificado") {
    label.textContent = "Precalificación favorable";
    title.textContent = "Sí, cumples las condiciones iniciales";
    message.textContent =
      "Puedes continuar con tu solicitud. La aprobación final depende de la evaluación de la entidad financiera.";
  } else if (result === "no_precalificado") {
    label.textContent = "Resultado de precalificación";
    title.textContent = "Por ahora, no cumples las condiciones iniciales";
    message.textContent =
      "No derivaremos esta solicitud a una entidad financiera. Puedes consultar con nuestros canales de atención sobre otras alternativas.";
  } else {
    label.textContent = "Resultado de evaluación";
    title.textContent = "Aún no hay un resultado disponible";
    message.textContent =
      "No encontramos el resultado de una evaluación asociada a esta solicitud.";
  }

  const product = query.get("producto") || evaluation.producto;
  const amount = query.get("monto") || evaluation.montoSolicitado;
  const term = query.get("plazo") || evaluation.plazoMeses;
  const details = document.getElementById("evaluationDetails");
  const detailItems = [];

  if (product) detailItems.push(`Producto: ${product}`);
  if (amount) detailItems.push(`Monto solicitado: ${amount}`);
  if (term) detailItems.push(`Plazo: ${term} meses`);

  if (detailItems.length) {
    details.replaceChildren(
      ...detailItems.map((text) => {
        const item = document.createElement("span");
        item.textContent = text;
        return item;
      }),
    );
    details.hidden = false;
  }
}

showEvaluationResult();
