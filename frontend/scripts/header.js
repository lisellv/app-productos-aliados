const header = document.getElementById("header");
const authTokenKey = "tech-store-auth-token";
const token = localStorage.getItem(authTokenKey);
let roles = [];
let isAuthenticated = false;

if (token) {
  try {
    const payloadPart = token.split(".")[1];
    const base64Payload = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadPart.length / 4) * 4, "=");
    const claims = JSON.parse(atob(base64Payload));
    isAuthenticated = claims.exp * 1000 > Date.now();
    roles = isAuthenticated ? String(claims.roles || "").split(",") : [];
  } catch {
    localStorage.removeItem(authTokenKey);
  }
}

const canAccessManagement = roles.some((role) =>
  ["ROLE_ADMIN", "ROLE_ALIADO"].includes(role),
);

if (
  window.location.pathname.endsWith("/mantenimientos.html") &&
  !canAccessManagement
) {
  window.location.replace("home.html");
}

const accountLinks = isAuthenticated
  ? `<a href="solicitudes.html">Bandeja de solicitudes</a>${canAccessManagement ? '<a href="mantenimientos.html">Panel de administración</a>' : ""}
     <a href="#" id="logoutLink">Cerrar sesión</a>`
  : '<a href="login.html">Iniciar sesión</a><a href="signout.html">Crear una cuenta</a>';

header.innerHTML = `
  <div class="top-bar">
    ${accountLinks}
  </div>
  <header class="main-header">
    <a class="logo" href="home.html">Financia Minegocio.PE</a>
    <div class="header-icons">
      <a class="icon-button" href="categories.html" aria-label="Buscar" title="Buscar">⌕</a>
      <a class="icon-button" href="cart.html" aria-label="Ver productos a financiar" title="Ver productos a financiar"><img src="img/home/carrito.png" alt=""></a>
    </div>
  </header>
`;

document.getElementById("logoutLink")?.addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.removeItem(authTokenKey);
  window.location.replace("home.html");
});
