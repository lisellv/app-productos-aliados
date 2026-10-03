const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const submitButton = loginForm.querySelector('button[type="submit"]');

  if (!username || !password) {
    loginMessage.textContent = "Debe ingresar usuario y contraseña.";
    return;
  }

  submitButton.disabled = true;
  loginMessage.textContent = "Iniciando sesión...";

  try {
    await login(username, password);
    window.location.href = "home.html";
  } catch (error) {
    if (error instanceof TypeError || error.message === "Failed to fetch") {
      loginMessage.textContent =
        "No se pudo conectar con el servidor. Verifica que Spring Boot esté activo y permita CORS.";
    } else if (
      error.message.includes("401") ||
      error.message.includes("403") ||
      error.message.includes("Credenciales inválidas") ||
      error.message.includes("AUTH_01")
    ) {
      loginMessage.textContent = "Usuario o contraseña incorrectos.";
    } else {
      loginMessage.textContent =
        "No se pudo iniciar sesión. Inténtalo nuevamente.";
    }
    console.error(error);
  } finally {
    submitButton.disabled = false;
  }
});
