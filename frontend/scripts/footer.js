const footer = document.getElementById("footer");

if (!footer) {
  console.warn("No se encontró el contenedor #footer.");
} else {
  footer.innerHTML = `
  <footer id="contacto">
    <div><h3>Oportunidades</h3><ul><li>Vehículos</li><li>Equipamiento</li><li>Inmuebles</li></ul></div>
    <div><h3>Compañía</h3><ul><li>Quiénes somos</li><li>Términos y condiciones</li><li>Privacidad</li></ul></div>
    <div><h3>Conecta</h3><ul><li>Contáctanos</li><li>Facebook</li><li>Instagram</li></ul></div>
    <div><h3 id="suscripcionMensaje">Suscríbete a nuestro boletín</h3><input id="correoSuscripcion" type="email" placeholder="Tu correo electrónico" required><button id="suscribirseBtn" type="button">Suscribirse</button></div>
    <p class="copy">Todos los derechos reservados © Financia .PE</p>
  </footer>
`;

  const suscripcionMensaje = document.getElementById("suscripcionMensaje");
  const correoSuscripcion = document.getElementById("correoSuscripcion");
  const botonSuscripcion = document.getElementById("suscribirseBtn");

  botonSuscripcion.addEventListener("click", () => {
    if (!correoSuscripcion.value.trim() || !correoSuscripcion.checkValidity()) {
      suscripcionMensaje.textContent = "Ingresa un correo válido.";
      suscripcionMensaje.style.color = "red";
      correoSuscripcion.focus();
      return;
    }
    suscripcionMensaje.textContent = "¡Gracias por suscribirte!";
    suscripcionMensaje.style.color = "green";
  });
}
