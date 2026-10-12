const FINANCING_CART_KEY = "tech-store-financing-cart";
const requestForm = document.getElementById("requestForm");
const applicationProducts = document.getElementById("applicationProducts");
const registrationMessage = document.getElementById("registrationMessage");
const submitRequest = document.getElementById("submitRequest");
const financingById = new Map();

function escapeRegistrationValue(value) {
  return String(value ?? "").replace(
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

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(FINANCING_CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function formatRegistrationMoney(value, currency) {
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency || "PEN",
    }).format(Number(value) || 0);
  } catch {
    return `${currency || "PEN"} ${Number(value || 0).toFixed(2)}`;
  }
}

function getCurrentFinancing(card) {
  return financingById.get(
    Number(card.querySelector("[data-financing-id]").value),
  );
}

function updateFinancingFields(card, resetValues = false) {
  const financing = getCurrentFinancing(card);
  const amount = card.querySelector("[data-request-amount]");
  const term = card.querySelector("[data-request-term]");
  const product = readCart().find(
    (item) => String(item.id) === card.dataset.productId,
  );
  if (!financing || !product) return;

  const estimatedAmount =
    (Number(product.price) || 0) * Math.max(1, Number(product.quantity) || 1);
  amount.min = financing.montoMinimo;
  amount.max = financing.montoMaximo;
  amount.step = "0.01";
  term.min = financing.plazoMinimoMeses;
  term.max = financing.plazoMaximoMeses;
  if (resetValues || !amount.value) {
    amount.value = Math.min(
      Number(financing.montoMaximo),
      Math.max(Number(financing.montoMinimo), estimatedAmount),
    ).toFixed(2);
  }
  if (resetValues || !term.value) term.value = financing.plazoMinimoMeses;
  card.querySelector("[data-financing-summary]").textContent =
    `${financing.tipoTasa} ${Number(financing.tasaAnual).toFixed(2)}% anual; monto ${formatRegistrationMoney(financing.montoMinimo, product.currency)} a ${formatRegistrationMoney(financing.montoMaximo, product.currency)}; plazo ${financing.plazoMinimoMeses}–${financing.plazoMaximoMeses} meses.`;
}

function renderCartProducts(cart, financingOptions) {
  if (!cart.length) {
    applicationProducts.innerHTML =
      '<p>No hay productos en el carrito. <a href="categories.html">Explora el catálogo.</a></p>';
    return false;
  }

  const cards = cart.map((item, index) => {
    const options = financingOptions.filter(
      (financing) => Number(financing.productoId) === Number(item.id),
    );
    const optionMarkup = options
      .map((financing) => {
        financingById.set(Number(financing.id), financing);
        return `<option value="${financing.id}">${escapeRegistrationValue(financing.tipoTasa)} ${Number(financing.tasaAnual).toFixed(2)}% anual</option>`;
      })
      .join("");

    if (!options.length) {
      return `<article class="application-product" data-product-id="${escapeRegistrationValue(item.id)}"><h3>${escapeRegistrationValue(item.name)}</h3><p>Este producto no tiene modalidades de financiamiento activas.</p></article>`;
    }

    return `
      <article class="application-product" data-product-id="${escapeRegistrationValue(item.id)}">
        <h3>${escapeRegistrationValue(item.name)}</h3>
        <p>Precio referencial: ${escapeRegistrationValue(formatRegistrationMoney(item.price, item.currency))} × ${Math.max(1, Number(item.quantity) || 1)}</p>
        <label>Modalidad
          <select data-financing-id name="financing-${index}" required>${optionMarkup}</select>
        </label>
        <p class="financing-summary" data-financing-summary></p>
        <div class="registration-fields">
          <label>Monto solicitado
            <input data-request-amount type="number" min="0" step="0.01" required>
          </label>
          <label>Plazo (meses)
            <input data-request-term type="number" min="1" step="1" required>
          </label>
        </div>
      </article>
    `;
  });

  applicationProducts.innerHTML = cards.join("");
  applicationProducts
    .querySelectorAll(".application-product")
    .forEach((card) => {
      if (card.querySelector("[data-financing-id]")) {
        updateFinancingFields(card, true);
      }
    });
  return cart.every((item) =>
    financingOptions.some(
      (financing) => Number(financing.productoId) === Number(item.id),
    ),
  );
}

function updateDocumentOptions() {
  const natural = requestForm.elements.tipoPersona.value === "NATURAL";
  const options = natural
    ? [
        ["DNI", "DNI"],
        ["CE", "Carné de extranjería"],
        ["PASAPORTE", "Pasaporte"],
      ]
    : [["RUC", "RUC"]];
  const select = requestForm.elements.tipoDocumento;
  select.replaceChildren(
    ...options.map(([value, label]) => new Option(label, value)),
  );
  document.querySelectorAll("[data-request-natural]").forEach((label) => {
    label.hidden = !natural;
    label.querySelector("input").required = natural;
  });
  document.querySelectorAll("[data-request-legal]").forEach((label) => {
    label.hidden = natural;
    label.querySelector("input").required = !natural;
  });
}

requestForm.elements.tipoPersona.addEventListener(
  "change",
  updateDocumentOptions,
);
updateDocumentOptions();

applicationProducts.addEventListener("change", (event) => {
  const select = event.target.closest("[data-financing-id]");
  if (select)
    updateFinancingFields(select.closest(".application-product"), true);
});

async function loadRegistrationOptions() {
  const cart = readCart();
  if (!cart.length) {
    renderCartProducts(cart, []);
    return;
  }

  try {
    const financingOptions = await apiRequest("/api/productos-financiamiento", {
      skipAuth: true,
    });
    const today = new Date().toISOString().slice(0, 10);
    const activeFinancing = (
      Array.isArray(financingOptions) ? financingOptions : []
    ).filter(
      (financing) =>
        financing.activo !== false &&
        (!financing.vigenteDesde || financing.vigenteDesde <= today) &&
        (!financing.vigenteHasta || financing.vigenteHasta >= today),
    );
    const hasOptions = renderCartProducts(cart, activeFinancing);
    submitRequest.disabled = !hasOptions;
    if (!hasOptions) {
      registrationMessage.textContent =
        "No todos los productos tienen una modalidad activa; no se puede registrar la solicitud.";
    }
  } catch (error) {
    applicationProducts.innerHTML =
      "<p>No se pudieron cargar las modalidades. Inténtalo más tarde.</p>";
    registrationMessage.textContent = error.message;
  }
}

function buildClientPayload() {
  const natural = requestForm.elements.tipoPersona.value === "NATURAL";
  return {
    tipoPersona: requestForm.elements.tipoPersona.value,
    tipoDocumento: requestForm.elements.tipoDocumento.value,
    numeroDocumento: requestForm.elements.numeroDocumento.value.trim(),
    nombres: natural ? requestForm.elements.nombres.value.trim() : null,
    apellidos: natural ? requestForm.elements.apellidos.value.trim() : null,
    razonSocial: natural ? null : requestForm.elements.razonSocial.value.trim(),
    correo: requestForm.elements.correo.value.trim() || null,
    telefono: requestForm.elements.telefono.value.trim() || null,
  };
}

function removeCartItem(productId) {
  const remaining = readCart().filter(
    (item) => String(item.id) !== String(productId),
  );
  localStorage.setItem(FINANCING_CART_KEY, JSON.stringify(remaining));
}

requestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registrationMessage.textContent = "";
  if (!requestForm.reportValidity()) return;

  const cards = [
    ...applicationProducts.querySelectorAll(".application-product"),
  ];
  if (!cards.length || cards.some((card) => !getCurrentFinancing(card))) {
    registrationMessage.textContent =
      "Agrega productos con modalidades disponibles antes de continuar.";
    return;
  }

  submitRequest.disabled = true;
  submitRequest.textContent = "Enviando...";
  const createdRequests = [];
  try {
    const client = await apiRequest("/api/clientes/registro", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify(buildClientPayload()),
    });

    for (const card of cards) {
      const financing = getCurrentFinancing(card);
      const amount = Number(card.querySelector("[data-request-amount]").value);
      const term = Number(card.querySelector("[data-request-term]").value);
      if (
        amount < Number(financing.montoMinimo) ||
        amount > Number(financing.montoMaximo)
      ) {
        throw new Error(
          `El monto de ${card.querySelector("h3").textContent} está fuera del rango permitido.`,
        );
      }
      if (
        term < financing.plazoMinimoMeses ||
        term > financing.plazoMaximoMeses
      ) {
        throw new Error(
          `El plazo de ${card.querySelector("h3").textContent} está fuera del rango permitido.`,
        );
      }

      const request = await apiRequest("/api/solicitudes-financiamiento", {
        method: "POST",
        body: JSON.stringify({
          clienteId: client.clienteId,
          productoId: Number(card.dataset.productId),
          productoFinanciamientoId: Number(financing.id),
          montoSolicitado: amount,
          plazoMeses: term,
          tasaTipoAplicada: financing.tipoTasa,
          tasaAnualAplicada: financing.tasaAnual,
          consentimiento: requestForm.elements.consentimiento.checked,
        }),
      });
      createdRequests.push(request);
      removeCartItem(card.dataset.productId);
      card.remove();
    }

    const firstCard = cards[0];
    sessionStorage.setItem(
      "tech-store-evaluation-result",
      JSON.stringify({
        resultadoPrecalificacion:
          createdRequests[0]?.resultadoPrecalificacion || "pendiente",
        producto: firstCard.querySelector("h3").textContent,
        montoSolicitado: createdRequests[0]?.montoSolicitado,
        plazoMeses: createdRequests[0]?.plazoMeses,
        solicitudIds: createdRequests.map((request) => request.id),
      }),
    );
    window.location.href = "resultado_evaluacion.html";
  } catch (error) {
    registrationMessage.textContent = createdRequests.length
      ? `Se registraron ${createdRequests.length} solicitud(es). ${error.message}`
      : error.message;
    submitRequest.disabled =
      applicationProducts.querySelectorAll(".application-product").length === 0;
  } finally {
    submitRequest.textContent = "Enviar solicitud";
  }
});

loadRegistrationOptions();
