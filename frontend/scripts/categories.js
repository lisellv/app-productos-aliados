const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const categoryFilter = document.getElementById("categoryFilter");
const filterButton = document.getElementById("botonFiltro");
const productsContainer = document.querySelector(".productos");

let products = [];
productsContainer.innerHTML = '<p role="status">Cargando productos...</p>';

function escapeHtml(value) {
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

function populateCategories(categories) {
  const options = [new Option("Todas las categorías", "all")];
  categories.forEach((category) => {
    options.push(new Option(category.nombre, String(category.id)));
  });
  categoryFilter.replaceChildren(...options);
}

function renderProducts(items) {
  if (!items.length) {
    productsContainer.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  productsContainer.innerHTML = items
    .map((product) => {
      const name = product.nombre || "Producto";
      const price = Number(product.precioLista) || 0;
      const image = product.imagenUrl || "img/productos/vehiculos/camion.jpg";
      const currency = product.moneda || "PEN";
      const formattedPrice = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency,
      }).format(price);

      return `
        <div class="producto" data-category="${escapeHtml(product.categoriaId)}" data-product-id="${escapeHtml(product.id)}" data-product-name="${escapeHtml(name)}" data-product-price="${price}" data-product-currency="${escapeHtml(currency)}" data-product-image="${escapeHtml(image)}">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}">
          <h3>${escapeHtml(name)}</h3>
          <p>${formattedPrice}</p>
          <div class="product-actions">
            <div class="cantidad" aria-label="Cantidad">
              <button type="button" data-product-quantity-step="-1" aria-label="Reducir cantidad" disabled>−</button>
              <input type="number" value="0" min="0" step="1" aria-label="Cantidad">
              <button type="button" data-product-quantity-step="1" aria-label="Aumentar cantidad">+</button>
            </div>
            <button class="add-to-cart-btn" type="button" data-add-to-cart>Agregar al carrito</button>
          </div>
          <p class="product-feedback" role="status" aria-live="polite"></p>
        </div>
      `;
    })
    .join("");
}

function applyFilters() {
  const min = minPrice.value === "" ? 0 : Number(minPrice.value);
  const max = maxPrice.value === "" ? Infinity : Number(maxPrice.value);
  const categoryId = categoryFilter.value;
  const filteredProducts = products.filter((product) => {
    const price = Number(product.precioLista) || 0;
    const matchesCategory =
      categoryId === "all" || String(product.categoriaId) === categoryId;
    return matchesCategory && price >= min && price <= max;
  });

  renderProducts(filteredProducts);
}

filterButton.addEventListener("click", applyFilters);

Promise.all([apiRequest("/api/categorias", { skipAuth: true }), getProducts()])
  .then(([categories, apiProducts]) => {
    populateCategories(categories);
    products = Array.isArray(apiProducts) ? apiProducts : [];
    applyFilters();
  })
  .catch((error) => {
    console.error("No se pudieron cargar los datos del catálogo.", error);
    productsContainer.innerHTML =
      "<p>No se pudieron cargar los productos. Inténtalo de nuevo más tarde.</p>";
  });
