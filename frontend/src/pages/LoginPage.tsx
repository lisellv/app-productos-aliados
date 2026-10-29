import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("Iniciando sesión...");
    try {
      await login(username.trim(), password);
      const returnTo =
        (location.state as { from?: string } | null)?.from || "/";
      navigate(returnTo, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      if (error instanceof TypeError || errorMessage === "Failed to fetch") {
        setMessage(
          "No se pudo conectar con el servidor. Verifica que Spring Boot esté activo.",
        );
      } else if (
        ["401", "403", "Credenciales inválidas", "AUTH_01"].some((value) =>
          errorMessage.includes(value),
        )
      ) {
        setMessage("Usuario o contraseña incorrectos.");
      } else {
        setMessage("No se pudo iniciar sesión. Inténtalo nuevamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-section">
      <form className="login-form" onSubmit={submit}>
        <h1>Inicia sesión en tu cuenta</h1>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="login-button" type="submit" disabled={submitting}>
          {submitting ? "Ingresando..." : "Iniciar sesión"}
        </button>
        <p role="status" aria-live="polite">
          {message}
        </p>
        <p className="create-account">
          ¿Aún no tienes cuenta? <Link to="/register">Crea una cuenta</Link>
        </p>
      </form>
    </main>
  );
}
