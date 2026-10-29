import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/ContextoAutenticacion";

export function LoginPage() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { iniciarSesion } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);
    setMensaje("Iniciando sesión...");
    try {
      await iniciarSesion(nombreUsuario.trim(), clave);
      const rutaRetorno =
        (ubicacion.state as { from?: string } | null)?.from || "/";
      navegar(rutaRetorno, { replace: true });
    } catch (errorCapturado) {
      const mensajeError =
        errorCapturado instanceof Error ? errorCapturado.message : "";
      if (errorCapturado instanceof TypeError) {
        setMensaje(
          "No se pudo conectar con el servidor. Verifica que Spring Boot esté activo.",
        );
      } else if (
        ["401", "403", "Credenciales inválidas", "AUTH_01"].some((codigo) =>
          mensajeError.includes(codigo),
        )
      ) {
        setMensaje("Usuario o contraseña incorrectos.");
      } else {
        setMensaje("No se pudo iniciar sesión. Inténtalo nuevamente.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login-section">
      <form className="login-form" onSubmit={enviarFormulario}>
        <h1>Inicia sesión en tu cuenta</h1>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          required
          value={nombreUsuario}
          onChange={(evento) => setNombreUsuario(evento.target.value)}
        />
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={clave}
          onChange={(evento) => setClave(evento.target.value)}
        />
        <button className="login-button" type="submit" disabled={enviando}>
          {enviando ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <p role="status" aria-live="polite">
          {mensaje}
        </p>
        <p className="create-account">
          ¿Aún no tienes cuenta? <Link to="/register">Crea una cuenta</Link>
        </p>
      </form>
    </main>
  );
}
