import { Link } from "react-router-dom";

export function AccountPage() {
  return (
    <main className="login-section">
      <section className="login-form" aria-labelledby="account-title">
        <h1 id="account-title">Crea una cuenta</h1>
        <p>
          Las cuentas de aliados y administradores son habilitadas por el
          administrador de la plataforma.
        </p>
        <p>Si ya tienes una cuenta, puedes iniciar sesión.</p>
        <Link className="login-button account-login-link" to="/login">
          Iniciar sesión
        </Link>
      </section>
    </main>
  );
}
