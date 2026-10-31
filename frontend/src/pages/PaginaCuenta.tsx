import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiAutenticacion } from "../api/autenticacionApi";
import { useAuth } from "../context/ContextoAutenticacion";

export function AccountPage() {
  const navegar = useNavigate();
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmacionPassword, setConfirmacionPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function crearCuenta(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje("");
    if (password !== confirmacionPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    const correoNormalizado = correo.trim().toLowerCase();
    try {
      await apiAutenticacion.registrarUsuario({
        correoElectronico: correoNormalizado,
        password,
      });
      await iniciarSesion(correoNormalizado, password);
      navegar("/", { replace: true });
    } catch (errorCapturado: unknown) {
      setMensaje(
        errorCapturado instanceof TypeError
          ? "No se pudo conectar con el servidor. Inténtalo nuevamente."
          : errorCapturado instanceof Error
            ? errorCapturado.message
            : "No se pudo crear la cuenta. Inténtalo nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login-section">
      <form className="login-form" onSubmit={crearCuenta}>
        <h1>Crea una cuenta</h1>
        <p>
          Regístrate para guardar tus datos y dar seguimiento a tus solicitudes.
        </p>
        <label htmlFor="account-email">Correo electrónico</label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          required
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
        />
        <label htmlFor="account-password">Contraseña</label>
        <input
          id="account-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={100}
          required
          value={password}
          onChange={(evento) => setPassword(evento.target.value)}
        />
        <label htmlFor="account-password-confirmation">
          Confirmar contraseña
        </label>
        <input
          id="account-password-confirmation"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={100}
          required
          value={confirmacionPassword}
          onChange={(evento) => setConfirmacionPassword(evento.target.value)}
        />
        <button className="login-button" type="submit" disabled={enviando}>
          {enviando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
        <p role="status" aria-live="polite">
          {mensaje}
        </p>
        <p className="create-account">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}
