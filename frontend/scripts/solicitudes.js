const requestsBody = document.getElementById("requestsBody");
const requestsScope = document.getElementById("requestsScope");
const requestsMessage = document.getElementById("requestsMessage");

function escapeRequestValue(value) {
  return String(value ?? "—").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function requestRoles() {
  try {
    const token = localStorage.getItem("tech-store-auth-token");
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return String(JSON.parse(atob(payload)).roles || "").split(",");
  } catch {
    return [];
  }
}

function formatRequestDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("es-PE");
}

function formatRequestMoney(value, currency) {
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency || "PEN",
    }).format(Number(value) || 0);
  } catch {
    return `${currency || "PEN"} ${Number(value || 0).toFixed(2)}`;
  }
}

function statusLabel(value) {
  const labels = {
    pendiente: "Pendiente",
    precalificado: "Precalificada",
    no_precalificado: "No precalificada",
    derivado: "Derivada",
    en_evaluacion: "En evaluación",
    aprobado: "Aprobada",
    rechazado: "Rechazada",
    cerrado: "Cerrada",
    cancelado: "Cancelada",
  };
  return labels[value] || value || "Sin estado";
}

function badge(value) {
  const className = /^[a-z_]+$/.test(value || "") ? value : "pendiente";
  return `<span class="request-badge request-badge--${className}">${escapeRequestValue(statusLabel(value))}</span>`;
}

function displayClient(client, request, administrator) {
  if (!administrator) return "Tu solicitud";
  if (!client) return `Cliente #${request.clienteId}`;
  return client.tipoPersona === "NATURAL"
    ? `${client.nombres || ""} ${client.apellidos || ""}`.trim() ||
        `Cliente #${request.clienteId}`
    : client.razonSocial || `Cliente #${request.clienteId}`;
}

function renderRequests(requests, products, clients, administrator) {
  if (!requests.length) {
    requestsBody.innerHTML =
      '<tr><td colspan="8">No hay solicitudes para mostrar.</td></tr>';
    return;
  }

  const productNames = new Map(
    products.map((product) => [product.id, product.nombre]),
  );
  const clientsById = new Map(clients.map((client) => [client.id, client]));
  requestsBody.innerHTML = requests
    .map(
      (request) => `
    <tr>
      <td>#${escapeRequestValue(request.id)}</td>
      <td>${escapeRequestValue(displayClient(clientsById.get(request.clienteId), request, administrator))}</td>
      <td>${escapeRequestValue(productNames.get(request.productoId) || `Producto #${request.productoId}`)}</td>
      <td>${escapeRequestValue(formatRequestMoney(request.montoSolicitado, request.moneda))}</td>
      <td>${escapeRequestValue(request.plazoMeses)} meses</td>
      <td>${badge(request.resultadoPrecalificacion)}</td>
      <td>${badge(request.estado)}</td>
      <td>${escapeRequestValue(formatRequestDate(request.creadoAt))}</td>
    </tr>
  `,
    )
    .join("");
}

async function loadRequests() {
  if (!localStorage.getItem("tech-store-auth-token")) {
    requestsScope.textContent = "Inicia sesión para consultar tus solicitudes.";
    requestsBody.innerHTML =
      '<tr><td colspan="8">Inicia sesión para continuar.</td></tr>';
    requestsMessage.innerHTML = '<a href="login.html">Iniciar sesión</a>';
    return;
  }

  const administrator = requestRoles().includes("ROLE_ADMIN");
  requestsScope.textContent = administrator
    ? "Vista de administrador: todas las solicitudes activas."
    : "Estas son las solicitudes creadas desde tu cuenta.";

  try {
    const [requests, products, clients] = await Promise.all([
      apiRequest("/api/solicitudes-financiamiento"),
      apiRequest("/api/productos", { skipAuth: true }).catch(() => []),
      administrator
        ? apiRequest("/api/clientes").catch(() => [])
        : Promise.resolve([]),
    ]);
    renderRequests(
      Array.isArray(requests) ? requests : [],
      Array.isArray(products) ? products : [],
      Array.isArray(clients) ? clients : [],
      administrator,
    );
  } catch (error) {
    requestsBody.innerHTML =
      '<tr><td colspan="8">No se pudieron cargar las solicitudes.</td></tr>';
    requestsMessage.textContent =
      error.message.includes("401") || error.message.includes("403")
        ? "Inicia sesión con una cuenta autorizada para ver esta bandeja."
        : error.message;
  }
}

loadRequests();
