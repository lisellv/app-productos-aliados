(function filtroproductos() {
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const botonFiltro = document.getElementById("botonFiltro");
  const productos = document.querySelectorAll(".producto");

  botonFiltro.addEventListener("click", () => {
    const min = minPrice.value === "" ? 0 : Number(minPrice.value);
    const max = maxPrice.value === "" ? 100000 : Number(maxPrice.value);

    productos.forEach((producto) => {
      const precio = Number(producto.getAttribute("precio-lista"));
      producto.style.display = precio >= min && precio <= max ? "" : "none";
    });
  });
})();

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

function renderProducts(products) {
  const productsContainer = document.querySelector(".productos");
  if (!Array.isArray(products) || !products.length) {
    return;
  }

  productsContainer.innerHTML = products
    .map((product) => {
      const name = product.name || product.nombre || "Producto";
      const price = Number(product.price ?? product.precio ?? 0);
      const image =
        product.imageUrl || product.imagen || "img/categories/react.jpg";

      return `
      <div class="producto" precio-lista="${price}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}">
        <h3>${escapeHtml(name)}</h3>
        <p>$${price.toFixed(2)}</p>
        <div class="cantidad">
          <button type="button">−</button>
          <input type="number" value="0" min="0">
          <button type="button">+</button>
        </div>
      </div>
    `;
    })
    .join("");
}

getProducts()
  .then(renderProducts)
  .catch((error) => {
    console.warn(
      "No se pudo cargar el catálogo remoto; se conserva el catálogo local.",
      error,
    );
  });
