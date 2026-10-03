function today() {
  return new Date().toLocaleDateString("es-PE");
}

function addRow(tbodyId, cellsHtml) {
  const tbody = document.getElementById(tbodyId);
  const row = document.createElement("tr");
  row.innerHTML =
    cellsHtml
      .map(
        (html, index) =>
          `<td${index === 0 ? ' class="admin-cell-link"' : ""}>${html}</td>`,
      )
      .join("") +
    `<td><button class="admin-delete-btn" type="button" aria-label="Eliminar">Eliminar</button></td>`;
  row
    .querySelector(".admin-delete-btn")
    .addEventListener("click", () => row.remove());
  tbody.prepend(row);
}

document.querySelectorAll(".admin-delete-btn").forEach((button) => {
  button.addEventListener("click", () => button.closest("tr").remove());
});

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
    document.getElementById(button.dataset.formToggle).classList.toggle("open");
  });
});

document.querySelectorAll("[data-form-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = document.getElementById(button.dataset.formClose);
    form.classList.remove("open");
    form.reset();
  });
});

document.getElementById("form-usuarios").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  addRow("tbody-usuarios", [
    form.correo.value,
    today(),
    form.rol.value === "administrador" ? "administrador, usuario" : "usuario",
  ]);
  form.reset();
  form.classList.remove("open");
});

document.getElementById("form-roles").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  addRow("tbody-roles", [form.nombre.value, form.estado.value]);
  form.reset();
  form.classList.remove("open");
});

document
  .getElementById("form-categorias")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    addRow("tbody-categorias", [
      form.nombre.value,
      form.descripcion.value || "—",
      form.estado.value,
    ]);
    form.reset();
    form.classList.remove("open");
  });

document
  .getElementById("form-financiamiento")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    addRow("tbody-financiamiento", [
      form.codigo.value,
      form.nombre.value,
      form.descripcion.value || "—",
      form.estado.value,
    ]);
    form.reset();
    form.classList.remove("open");
  });

document.getElementById("form-aliados").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  addRow("tbody-aliados", [
    form.razonSocial.value,
    form.ruc.value,
    form.contacto.value || "—",
    form.estado.value,
  ]);
  form.reset();
  form.classList.remove("open");
});

document.getElementById("form-reglas").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const monto = (value) => `S/ ${Number(value).toFixed(2)}`;
  addRow("tbody-reglas", [
    form.campana.value,
    `${form.edadMinima.value} - ${form.edadMaxima.value}`,
    monto(form.ingresoMinimo.value),
    `${monto(form.montoMinimo.value)} - ${monto(form.montoMaximo.value)}`,
    `${form.plazoMinimo.value} - ${form.plazoMaximo.value}`,
  ]);
  form.reset();
  form.classList.remove("open");
});
