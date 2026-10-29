import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartIcon } from "./CartIcon";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, canAccessManagement, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  return (
    <div className="site-shell">
      <div className="top-bar">
        {isAuthenticated ? (
          <>
            <Link to="/requests">Bandeja de solicitudes</Link>
            {canAccessManagement && (
              <Link to="/admin">Panel de administración</Link>
            )}
            <button
              type="button"
              className="header-text-button"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Crear una cuenta</Link>
          </>
        )}
      </div>
      <header className="main-header">
        <Link className="logo" to="/">
          Financia Minegocio.PE
        </Link>
        <nav className="header-icons" aria-label="Navegación principal">
          <Link
            className="icon-button"
            to="/products"
            aria-label="Buscar productos"
            title="Buscar productos"
          >
            ⌕
          </Link>
          <CartIcon />
        </nav>
      </header>
      {children}
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
          onSubmit={(event) => {
            event.preventDefault();
            setSubscriptionMessage("¡Gracias por suscribirte!");
          }}
        >
          <h3>{subscriptionMessage || "Suscríbete a nuestro boletín"}</h3>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Tu correo electrónico"
            required
          />
          <button type="submit">Suscribirse</button>
        </form>
        <p className="copy">
          Todos los derechos reservados © Financia Minegocio.PE
        </p>
      </footer>
    </div>
  );
}
