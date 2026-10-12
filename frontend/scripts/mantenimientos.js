const sidebar = document.getElementById("adminSidebar");
document.getElementById("menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.querySelectorAll(".admin-nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".admin-nav-item")
      .forEach((button) => button.classList.remove("active"));
    document
      .querySelectorAll(".admin-panel")
      .forEach((panel) => panel.classList.remove("active"));
    item.classList.add("active");
    document.getElementById(item.dataset.target).classList.add("active");
    sidebar.classList.remove("open");
  });
});

document.querySelectorAll("[data-form-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = document.getElementById(button.dataset.formToggle);
    if (!form.classList.contains("open")) {
      form.reset();
      resetMaintenanceFormState(form);
    }
    form.classList.toggle("open");
  });
});

document.querySelectorAll("[data-form-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = document.getElementById(button.dataset.formClose);
    form.classList.remove("open");
    form.reset();
    resetMaintenanceFormState(form);
  });
});

document.getElementById("form-usuarios").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  saveMaintenanceRecord(form, "/api/usuarios", () => {
    const payload = {
      rolId: Number(form.elements.rolId.value),
      aliadoId: form.elements.aliadoId.value
        ? Number(form.elements.aliadoId.value)
        : null,
      correoElectronico: form.elements.correo.value.trim(),
    };
    if (form.elements.password.value) {
      payload.password = form.elements.password.value;
    }
    if (form.dataset.recordId) {
      payload.activo = form.elements.estado.value === "true";
    }
    return payload;
  });
});

document.getElementById("form-roles").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  saveMaintenanceRecord(form, "/api/roles", () => ({
    nombreRol: form.elements.nombre.value.trim(),
  }));
});

document
  .getElementById("form-categorias")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    saveMaintenanceRecord(form, "/api/categorias", () => {
      const payload = {
        nombre: form.elements.nombre.value.trim(),
        descripcion: optionalValue(form.elements.descripcion.value),
      };
      if (form.dataset.recordId) {
        payload.activo = form.elements.estado.value === "true";
      }
      return payload;
    });
  });

document
  .getElementById("form-financiamiento")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    saveMaintenanceRecord(form, "/api/tipos-financiamiento", () => {
      const payload = {
        nombre: form.elements.nombre.value.trim(),
        descripcion: optionalValue(form.elements.descripcion.value),
      };
      if (!form.dataset.recordId) {
        payload.codigo = form.elements.codigo.value;
      } else {
        payload.activo = form.elements.estado.value === "true";
      }
      return payload;
    });
  });

document.getElementById("form-aliados").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  saveMaintenanceRecord(form, "/api/aliados", () => {
    const payload = {
      razonSocial: form.elements.razonSocial.value.trim(),
      numeroDocumento: form.elements.numeroDocumento.value.trim(),
      contactoNombre: optionalValue(form.elements.contactoNombre.value),
      contactoCorreo: optionalValue(form.elements.contactoCorreo.value),
      contactoTelefono: optionalValue(form.elements.contactoTelefono.value),
    };
    if (form.dataset.recordId) payload.estado = form.elements.estado.value;
    return payload;
  });
});

document.getElementById("form-clientes").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const natural = form.elements.tipoPersona.value === "NATURAL";
  saveMaintenanceRecord(form, "/api/clientes", () => ({
    tipoPersona: form.elements.tipoPersona.value,
    tipoDocumento: form.elements.tipoDocumento.value,
    numeroDocumento: form.elements.numeroDocumento.value.trim(),
    nombres: natural ? optionalValue(form.elements.nombres.value) : null,
    apellidos: natural ? optionalValue(form.elements.apellidos.value) : null,
    razonSocial: natural
      ? null
      : optionalValue(form.elements.razonSocial.value),
    correo: optionalValue(form.elements.correo.value),
    telefono: optionalValue(form.elements.telefono.value),
  }));
});

document
  .getElementById("form-productos")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    saveMaintenanceRecord(form, "/api/productos", () => {
      const payload = {
        aliadoId: Number(form.elements.aliadoId.value),
        categoriaId: form.elements.categoriaId.value
          ? Number(form.elements.categoriaId.value)
          : null,
        nombre: form.elements.nombre.value.trim(),
        descripcion: optionalValue(form.elements.descripcion.value),
        precioLista: Number(form.elements.precioLista.value),
        moneda: form.elements.moneda.value,
        incluyeIgv: form.elements.incluyeIgv.value === "true",
        imagenUrl: optionalValue(form.elements.imagenUrl.value),
      };
      if (form.dataset.recordId) payload.estado = form.elements.estado.value;
      return payload;
    });
  });

document.getElementById("form-campanas").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  saveMaintenanceRecord(form, "/api/campanas", () => {
    const payload = {
      nombre: form.elements.nombre.value.trim(),
      descripcion: optionalValue(form.elements.descripcion.value),
      fechaInicio: form.elements.fechaInicio.value,
      fechaFin: form.elements.fechaFin.value,
    };
    if (form.dataset.recordId) payload.estado = form.elements.estado.value;
    return payload;
  });
});

document.getElementById("form-reglas").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  saveMaintenanceRecord(form, "/api/reglas-precalificacion", () => {
    const payload = {
      edadMinima: Number(form.elements.edadMinima.value),
      edadMaxima: Number(form.elements.edadMaxima.value),
      ingresoMinimo: Number(form.elements.ingresoMinimo.value),
      montoMinimo: Number(form.elements.montoMinimo.value),
      montoMaximo: Number(form.elements.montoMaximo.value),
      plazoMinimoMeses: Number(form.elements.plazoMinimo.value),
      plazoMaximoMeses: Number(form.elements.plazoMaximo.value),
    };
    if (form.dataset.recordId) {
      payload.activo = form.elements.estado.value === "true";
    } else {
      payload.campanaId = Number(form.elements.campanaId.value);
    }
    return payload;
  });
});

function escapeTableValue(value) {
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

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("es-PE") : "—";
}

function formatMoney(value) {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function optionalValue(value) {
  return value.trim() || null;
}

const maintenanceFormByEndpoint = {
  "/api/usuarios": "form-usuarios",
  "/api/roles": "form-roles",
  "/api/categorias": "form-categorias",
  "/api/tipos-financiamiento": "form-financiamiento",
  "/api/aliados": "form-aliados",
  "/api/clientes": "form-clientes",
  "/api/productos": "form-productos",
  "/api/campanas": "form-campanas",
  "/api/reglas-precalificacion": "form-reglas",
};
const maintenanceRecords = new Map();

function resetMaintenanceFormState(form) {
  delete form.dataset.recordId;
  form.querySelector('[type="submit"]').textContent = "Guardar";
  ["numeroDocumento", "aliadoId", "codigo", "campanaId"].forEach((name) => {
    const field = form.elements.namedItem(name);
    if (field) field.disabled = false;
  });
  if (form.elements.password) {
    form.elements.password.required = true;
  }
}

function fillForm(form, record) {
  const values = {
    correo: record.correoElectronico ?? record.correo,
    password: "",
    rolId: record.rolId,
    aliadoId: record.aliadoId,
    estado: record.activo ?? record.estado,
    nombre: record.nombreRol ?? record.nombre,
    codigo: record.codigo,
    campanaId: record.campanaId,
    edadMinima: record.edadMinima,
    edadMaxima: record.edadMaxima,
    ingresoMinimo: record.ingresoMinimo,
    montoMinimo: record.montoMinimo,
    montoMaximo: record.montoMaximo,
    plazoMinimo: record.plazoMinimoMeses,
    plazoMaximo: record.plazoMaximoMeses,
    razonSocial: record.razonSocial,
    numeroDocumento: record.numeroDocumento,
    contactoNombre: record.contactoNombre,
    contactoCorreo: record.contactoCorreo,
    contactoTelefono: record.contactoTelefono,
    tipoPersona: record.tipoPersona,
    tipoDocumento: record.tipoDocumento,
    nombres: record.nombres,
    apellidos: record.apellidos,
    correo: record.correo,
    telefono: record.telefono,
    aliadoId: record.aliadoId,
    categoriaId: record.categoriaId,
    nombre: record.nombre,
    descripcion: record.descripcion,
    precioLista: record.precioLista,
    moneda: record.moneda,
    incluyeIgv: record.incluyeIgv,
    imagenUrl: record.imagenUrl,
    fechaInicio: record.fechaInicio?.slice(0, 10),
    fechaFin: record.fechaFin?.slice(0, 10),
  };

  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field && value != null && name !== "password") {
      field.value =
        name === "estado" && typeof value === "boolean" ? String(value) : value;
    }
  });
}

function editMaintenanceRecord(endpoint, recordId) {
  const record = maintenanceRecords.get(endpoint)?.get(String(recordId));
  const form = document.getElementById(maintenanceFormByEndpoint[endpoint]);
  if (!record || !form) return;

  form.reset();
  resetMaintenanceFormState(form);
  if (endpoint === "/api/clientes") {
    form.elements.tipoPersona.value = record.tipoPersona;
    clientTypeSelect.dispatchEvent(new Event("change"));
  }
  fillForm(form, record);
  form.dataset.recordId = String(record.id);
  form.querySelector('[type="submit"]').textContent = "Actualizar";
  if (form.elements.password) {
    form.elements.password.required = false;
  }
  if (endpoint === "/api/aliados") {
    form.elements.numeroDocumento.disabled = true;
  }
  if (endpoint === "/api/productos") {
    form.elements.aliadoId.disabled = true;
  }
  if (endpoint === "/api/tipos-financiamiento") {
    form.elements.codigo.disabled = true;
  }
  if (endpoint === "/api/reglas-precalificacion") {
    form.elements.campanaId.disabled = true;
  }
  form.classList.add("open");
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function saveMaintenanceRecord(form, endpoint, getPayload) {
  const submitButton = form.querySelector('[type="submit"]');
  const recordId = form.dataset.recordId;
  const method = recordId ? "PUT" : "POST";
  const payload = getPayload();
  if (recordId && endpoint === "/api/aliados") {
    delete payload.numeroDocumento;
  }
  if (recordId && endpoint === "/api/productos") {
    delete payload.aliadoId;
    delete payload.moneda;
  }
  if (recordId && endpoint === "/api/tipos-financiamiento") {
    delete payload.codigo;
  }
  if (recordId && endpoint === "/api/reglas-precalificacion") {
    delete payload.campanaId;
  }
  submitButton.disabled = true;
  try {
    await apiRequest(recordId ? `${endpoint}/${recordId}` : endpoint, {
      method,
      body: JSON.stringify(payload),
    });
    form.reset();
    form.classList.remove("open");
    resetMaintenanceFormState(form);
    await loadMaintenanceTables();
  } catch (error) {
    window.alert(error.message);
  } finally {
    submitButton.disabled = false;
  }
}

async function deleteMaintenanceRecord(endpoint) {
  if (!window.confirm("¿Eliminar este registro?")) return;
  try {
    await apiRequest(endpoint, { method: "DELETE" });
    await loadMaintenanceTables();
  } catch (error) {
    window.alert(error.message);
  }
}

document.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-endpoint]");
  if (editButton) {
    editMaintenanceRecord(
      editButton.dataset.editEndpoint,
      editButton.dataset.recordId,
    );
    return;
  }
  const button = event.target.closest("[data-delete-endpoint]");
  if (button) deleteMaintenanceRecord(button.dataset.deleteEndpoint);
});

const clientTypeSelect =
  document.getElementById("form-clientes").elements.tipoPersona;
clientTypeSelect.addEventListener("change", (event) => {
  const natural = event.target.value === "NATURAL";
  document.querySelectorAll("[data-client-natural]").forEach((label) => {
    label.hidden = !natural;
    label.querySelector("input").required = natural;
  });
  document.querySelectorAll("[data-client-legal]").forEach((label) => {
    label.hidden = natural;
    label.querySelector("input").required = !natural;
  });
  const documentType = document.querySelector(
    '#form-clientes [name="tipoDocumento"]',
  );
  documentType.value = natural ? "DNI" : "RUC";
  [...documentType.options].forEach((option) => {
    option.disabled = natural ? option.value === "RUC" : option.value !== "RUC";
  });
});
clientTypeSelect.dispatchEvent(new Event("change"));

async function getTableData(endpoint) {
  try {
    const rows = await apiRequest(endpoint);
    return { rows: Array.isArray(rows) ? rows : [] };
  } catch (error) {
    return { error };
  }
}

function renderDatabaseTable(tbodyId, result, columnCount, mapRow, endpoint) {
  const tbody = document.getElementById(tbodyId);
  if (endpoint) {
    maintenanceRecords.set(
      endpoint,
      new Map((result.rows || []).map((record) => [String(record.id), record])),
    );
  }
  if (result.error) {
    const message = result.error.message.includes("403")
      ? "No autorizado. Inicia sesión con una cuenta administradora."
      : "No se pudieron cargar los datos.";
    tbody.innerHTML = `<tr><td colspan="${columnCount}">${message}</td></tr>`;
    return;
  }

  if (result.rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columnCount}">Sin registros.</td></tr>`;
    return;
  }

  tbody.innerHTML = result.rows
    .map((record) => {
      const cells = mapRow(record);
      const action = maintenanceFormByEndpoint[endpoint]
        ? `<td class="admin-row-actions"><button class="admin-edit-btn" type="button" data-edit-endpoint="${endpoint}" data-record-id="${record.id}" aria-label="Editar ${escapeTableValue(cells[0])}">Editar</button><button class="admin-delete-btn" type="button" data-delete-endpoint="${endpoint}/${record.id}" aria-label="Eliminar ${escapeTableValue(cells[0])}">Eliminar</button></td>`
        : "";
      return `<tr>${cells
        .map(
          (value, index) =>
            `<td${index === 0 ? ' class="admin-cell-link"' : ""}>${escapeTableValue(value)}</td>`,
        )
        .join("")}${action}</tr>`;
    })
    .join("");
}

async function loadMaintenanceTables() {
  const tableConfigs = [
    ["tbody-usuarios", "/api/usuarios", 4],
    ["tbody-roles", "/api/roles", 3],
    ["tbody-categorias", "/api/categorias", 4],
    ["tbody-financiamiento", "/api/tipos-financiamiento", 5],
    ["tbody-aliados", "/api/aliados", 5],
    ["tbody-clientes", "/api/clientes", 6],
    ["tbody-productos", "/api/productos", 6],
    ["tbody-campanas", "/api/campanas", 5],
    ["tbody-reglas", "/api/reglas-precalificacion", 6],
  ];
  tableConfigs.forEach(([tbodyId, , columnCount]) => {
    document.getElementById(tbodyId).innerHTML =
      `<tr><td colspan="${columnCount}">Cargando datos...</td></tr>`;
  });

  const endpoints = tableConfigs.map(([, endpoint]) => endpoint);
  const [
    users,
    roles,
    categories,
    financing,
    allies,
    clients,
    products,
    campaigns,
    rules,
  ] = await Promise.all([...endpoints.map(getTableData)]);
  const roleNames = new Map(
    (roles.rows || []).map((role) => [role.id, role.nombreRol]),
  );
  const campaignNames = new Map(
    (campaigns.rows || []).map((campaign) => [campaign.id, campaign.nombre]),
  );

  renderDatabaseTable(
    "tbody-usuarios",
    users,
    4,
    (user) => [
      user.correoElectronico,
      formatDate(user.creadoAt),
      roleNames.get(user.rolId) || `Rol ${user.rolId}`,
    ],
    "/api/usuarios",
  );
  renderDatabaseTable(
    "tbody-roles",
    roles,
    3,
    (role) => [role.nombreRol, Number(role.alta) === 1 ? "Activo" : "Inactivo"],
    "/api/roles",
  );
  renderDatabaseTable(
    "tbody-categorias",
    categories,
    4,
    (category) => [
      category.nombre,
      category.descripcion,
      category.activo ? "Activo" : "Inactivo",
    ],
    "/api/categorias",
  );
  renderDatabaseTable(
    "tbody-financiamiento",
    financing,
    5,
    (item) => [
      item.codigo,
      item.nombre,
      item.descripcion,
      item.activo ? "Activo" : "Inactivo",
    ],
    "/api/tipos-financiamiento",
  );
  renderDatabaseTable(
    "tbody-aliados",
    allies,
    5,
    (ally) => [
      ally.razonSocial,
      ally.numeroDocumento,
      ally.contactoNombre,
      ally.estado,
    ],
    "/api/aliados",
  );
  renderDatabaseTable(
    "tbody-clientes",
    clients,
    6,
    (client) => [
      client.tipoPersona === "NATURAL" ? "Natural" : "Jurídica",
      `${client.tipoDocumento} ${client.numeroDocumento}`,
      client.tipoPersona === "NATURAL"
        ? `${client.nombres || ""} ${client.apellidos || ""}`.trim()
        : client.razonSocial,
      client.correo,
      client.telefono,
    ],
    "/api/clientes",
  );
  const allyNames = new Map(
    (allies.rows || []).map((ally) => [ally.id, ally.razonSocial]),
  );
  const categoryNames = new Map(
    (categories.rows || []).map((category) => [category.id, category.nombre]),
  );
  renderDatabaseTable(
    "tbody-productos",
    products,
    6,
    (product) => [
      product.nombre,
      allyNames.get(product.aliadoId) || `Aliado ${product.aliadoId}`,
      categoryNames.get(product.categoriaId) || "Sin categoría",
      `${formatMoney(product.precioLista)} ${product.moneda || "PEN"}`,
      product.estado,
    ],
    "/api/productos",
  );
  renderDatabaseTable(
    "tbody-campanas",
    campaigns,
    5,
    (campaign) => [
      campaign.nombre,
      campaign.descripcion,
      `${formatDate(campaign.fechaInicio)} - ${formatDate(campaign.fechaFin)}`,
      campaign.estado,
    ],
    "/api/campanas",
  );
  renderDatabaseTable(
    "tbody-reglas",
    rules,
    6,
    (rule) => [
      campaignNames.get(rule.campanaId) || `Campaña ${rule.campanaId}`,
      `${rule.edadMinima} - ${rule.edadMaxima}`,
      formatMoney(rule.ingresoMinimo),
      `${formatMoney(rule.montoMinimo)} - ${formatMoney(rule.montoMaximo)}`,
      `${rule.plazoMinimoMeses} - ${rule.plazoMaximoMeses}`,
    ],
    "/api/reglas-precalificacion",
  );

  populateSelect('#form-usuarios [name="rolId"]', roles.rows, "nombreRol");
  populateSelect(
    '#form-usuarios [name="aliadoId"]',
    allies.rows,
    "razonSocial",
    true,
  );
  populateSelect('#form-reglas [name="campanaId"]', campaigns.rows, "nombre");

  populateSelect(
    '#form-productos [name="aliadoId"]',
    allies.rows,
    "razonSocial",
  );
  populateSelect(
    '#form-productos [name="categoriaId"]',
    categories.rows,
    "nombre",
    true,
  );
}

function populateSelect(selector, rows, labelProperty, allowEmpty = false) {
  const select = document.querySelector(selector);
  const firstOption = select.options[0];
  select.replaceChildren(firstOption);
  if (allowEmpty) firstOption.value = "";
  rows.forEach((record) => {
    const option = document.createElement("option");
    option.value = record.id;
    option.textContent = record[labelProperty];
    select.append(option);
  });
}

loadMaintenanceTables();
