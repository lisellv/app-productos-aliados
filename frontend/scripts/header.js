const header = document.getElementById("header");

header.innerHTML = `
  <div class="top-bar">
    <a href="login.html">Iniciar sesión</a>
    <a href="signout.html">Crear una cuenta</a>
    <a href="mantenimientos.html">Panel de administración</a>
  </div>
  <header class="main-header">
    <a class="logo" href="home.html">Financia .PE</a>
    <div class="header-icons">
      <a class="icon-button" href="categories.html" aria-label="Buscar">⌕</a>
      <a class="icon-button" href="signout.html" aria-label="Contacto"><img src="img/home/user.jpg" alt="Contacto"></a>
      <a class="icon-button" href="cart.html" aria-label="Carrito"><img src="img/home/carrito.png" alt="Carrito"></a>
    </div>
  </header>
`;
