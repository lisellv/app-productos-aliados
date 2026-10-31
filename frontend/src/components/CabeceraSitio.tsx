import { Link } from "react-router-dom";
import { useAuth } from "../context/ContextoAutenticacion";
import { CartIcon } from "./IconoCarrito";

export function SiteHeader() {
  const { estaAutenticado, esAliado, puedeAdministrar, cerrarSesion } =
    useAuth();

  return (
    <>
      <div className="top-bar">
        <span>FINANCIAMIENTO SIMPLE PARA NEGOCIOS QUE NO SE DETIENEN</span>
      </div>
      <header className="main-header">
        <Link className="logo" to="/" aria-label="Financia Mi Negocio, inicio">
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          <span className="brand-name">
            Financia <strong>Mi Negocio</strong>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Navegación principal">
          <Link to="/#soluciones">Soluciones</Link>
          <Link to="/#proceso">Cómo funciona</Link>
          <Link to="/#beneficios">Beneficios</Link>
          <Link to="/#contacto">Ayuda</Link>
        </nav>
        <div className="header-actions">
          {estaAutenticado ? (
            <>
              <Link to="/requests">Solicitudes</Link>
              {esAliado && <Link to="/ally">Mi aliado</Link>}
              {puedeAdministrar && <Link to="/admin">Administración</Link>}
              <button
                type="button"
                className="header-text-button"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link className="header-create-account" to="/register">
                Crear cuenta
              </Link>
            </>
          )}
          <CartIcon />
        </div>
      </header>
    </>
  );
}
