import { useState } from "react";

export function SiteFooter() {
  const [correo, setCorreo] = useState("");
  const [mensajeSuscripcion, setMensajeSuscripcion] = useState("");

  return (
    <footer id="contacto">
      <div>
        <h3>Oportunidades</h3>
        <ul>
          <li>Vehículos</li>
          <li>Equipamiento</li>
          <li>Inmuebles</li>
        </ul>
      </div>
      <div>
        <h3>Compañía</h3>
        <ul>
          <li>Quiénes somos</li>
          <li>Términos y condiciones</li>
          <li>Privacidad</li>
        </ul>
      </div>
      <div>
        <h3>Conecta</h3>
        <ul>
          <li>Contáctanos</li>
          <li>Facebook</li>
          <li>Instagram</li>
        </ul>
      </div>
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          setMensajeSuscripcion("¡Gracias por suscribirte!");
        }}
      >
        <h3>{mensajeSuscripcion || "Suscríbete a nuestro boletín"}</h3>
        <input
          type="email"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          placeholder="Tu correo electrónico"
          required
        />
        <button type="submit">Suscribirse</button>
      </form>
      <p className="copy">
        Todos los derechos reservados © Financia Minegocio.PE
      </p>
    </footer>
  );
}
