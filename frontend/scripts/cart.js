const FINANCING_CART_KEY = "tech-store-financing-cart";

function readFinancingCart() {
  try {
    const items = JSON.parse(localStorage.getItem(FINANCING_CART_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveFinancingCart(items) {
  localStorage.setItem(FINANCING_CART_KEY, JSON.stringify(items));
  renderFinancingCart();
}

function escapeCartValue(value) {
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

function formatCartPrice(amount, currency) {
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency || "PEN",
    }).format(amount);
  } catch {
    return `${currency || "PEN"} ${Number(amount).toFixed(2)}`;
  }
}

function clampQuantity(value, minimum) {
  const quantity = Math.floor(Number(value));
  return Number.isFinite(quantity) ? Math.max(minimum, quantity) : minimum;
}

function renderFinancingCart() {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;

  const items = readFinancingCart();
  const totalElement = document.getElementById("cartTotal");
  const confirmOrder = document.getElementById("confirmOrder");

  if (items.length === 0) {
    cartItems.innerHTML =
      '<p class="cart-empty">Aún no agregaste productos.</p>';
    totalElement.textContent = formatCartPrice(0, "PEN");
    confirmOrder.classList.add("is-disabled");
    confirmOrder.setAttribute("aria-disabled", "true");
    return;
  }

  cartItems.innerHTML = items
    .map((item) => {
      const id = escapeCartValue(item.id);
      const name = escapeCartValue(item.name);
      const image = escapeCartValue(
        item.image || "img/productos/vehiculos/camion.jpg",
      );
      const quantity = clampQuantity(item.quantity, 1);
      const currency = escapeCartValue(item.currency || "PEN");
      const price = Number(item.price) || 0;

      return `
        <article class="cart-item" data-cart-id="${id}">
          <div class="product-box">
            <div class="product-thumb">
              <img src="${image}" alt="${name}">
            </div>
            <div class="product-meta">
              <div class="product-name">${name}</div>
              <div class="product-row">
                <span class="price">${formatCartPrice(price, currency)}</span>
                <div class="quantity" aria-label="Cantidad">
                  <button type="button" data-cart-quantity-step="-1" aria-label="Reducir cantidad" ${quantity <= 1 ? "disabled" : ""}>−</button>
                  <input type="number" value="${quantity}" min="1" step="1" data-cart-quantity aria-label="Cantidad de ${name}">
                  <button type="button" data-cart-quantity-step="1" aria-label="Aumentar cantidad">+</button>
                </div>
              </div>
            </div>
          </div>
          <button class="cart-remove-btn" type="button" data-remove-cart-item>Eliminar</button>
        </article>
      `;
    })
    .join("");

  const totalsByCurrency = new Map();
  items.forEach((item) => {
    const currency = item.currency || "PEN";
    totalsByCurrency.set(
      currency,
      (totalsByCurrency.get(currency) || 0) +
        (Number(item.price) || 0) * clampQuantity(item.quantity, 1),
    );
  });
  totalElement.textContent = [...totalsByCurrency]
    .map(([currency, total]) => formatCartPrice(total, currency))
    .join(" · ");
  confirmOrder.classList.remove("is-disabled");
  confirmOrder.setAttribute("aria-disabled", "false");
}

function updateCartItem(itemId, update) {
  const items = readFinancingCart();
  const index = items.findIndex((item) => String(item.id) === String(itemId));
  if (index < 0) return;
  const nextItem = update(items[index]);
  if (nextItem) items[index] = nextItem;
  else items.splice(index, 1);
  saveFinancingCart(items);
}

document.addEventListener("click", (event) => {
  const productStepButton = event.target.closest(
    "[data-product-quantity-step]",
  );
  if (productStepButton) {
    const productCard = productStepButton.closest(".producto");
    const quantityInput = productCard.querySelector('input[type="number"]');
    const nextQuantity = clampQuantity(
      Number(quantityInput.value) +
        Number(productStepButton.dataset.productQuantityStep),
      0,
    );
    quantityInput.value = String(nextQuantity);
    productCard.querySelector('[data-product-quantity-step="-1"]').disabled =
      nextQuantity === 0;
    productCard.querySelector(".product-feedback").textContent = "";
    return;
  }

  const addButton = event.target.closest("[data-add-to-cart]");
  if (addButton) {
    const productCard = addButton.closest(".producto");
    const quantity = clampQuantity(
      productCard.querySelector('input[type="number"]').value,
      0,
    );
    const feedback = productCard.querySelector(".product-feedback");
    if (quantity < 1) {
      feedback.textContent = "Selecciona una cantidad primero.";
      return;
    }

    const productId = productCard.dataset.productId;
    const items = readFinancingCart();
    const existingItem = items.find(
      (item) => String(item.id) === String(productId),
    );
    if (existingItem) {
      existingItem.quantity =
        clampQuantity(existingItem.quantity, 1) + quantity;
    } else {
      items.push({
        id: productId,
        name: productCard.dataset.productName,
        price: Number(productCard.dataset.productPrice) || 0,
        currency: productCard.dataset.productCurrency || "PEN",
        image: productCard.dataset.productImage,
        quantity,
      });
    }
    saveFinancingCart(items);
    feedback.textContent = "Agregado al carrito.";
    return;
  }

  const cartItem = event.target.closest(".cart-item");
  if (!cartItem) return;
  const itemId = cartItem.dataset.cartId;

  if (event.target.closest("[data-cart-quantity-step]")) {
    const step = Number(
      event.target.closest("[data-cart-quantity-step]").dataset
        .cartQuantityStep,
    );
    updateCartItem(itemId, (item) => {
      const quantity = clampQuantity(item.quantity, 1) + step;
      return quantity < 1 ? null : { ...item, quantity };
    });
  } else if (event.target.closest("[data-remove-cart-item]")) {
    updateCartItem(itemId, () => null);
  }
});

document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-cart-quantity]")) return;
  const cartItem = event.target.closest(".cart-item");
  updateCartItem(cartItem.dataset.cartId, (item) => ({
    ...item,
    quantity: clampQuantity(event.target.value, 1),
  }));
});

document.getElementById("confirmOrder")?.addEventListener("click", (event) => {
  if (readFinancingCart().length === 0) event.preventDefault();
});

window.addEventListener("storage", (event) => {
  if (event.key === FINANCING_CART_KEY) renderFinancingCart();
});

renderFinancingCart();
