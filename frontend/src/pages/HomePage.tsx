import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main>
      <section className="banner">
        <div className="banner-copy">
          <span className="banner-kicker">FINANCIAMIENTO PARA TU NEGOCIO</span>
          <h1>Impulsa tu negocio: financiamiento rápido y a medida</h1>
          <p className="blanco">
            Adquiere la maquinaria, mercadería o vehículos que tu negocio
            necesita. Comienza tu financiamiento aquí.
          </p>
          <Link to="/products" className="banner-button">
            Busca productos y solicita financiamiento
          </Link>
        </div>
        <div
          className="hero-panels"
          aria-label="Camión de carga de un aliado comercial"
        >
          <img
            className="hero-card-image"
            src="/img/home/fondo.jpg"
            alt="Camión de carga de un aliado comercial"
          />
        </div>
      </section>
      <section className="promesa">
        <h2>Tu compra, paso a paso</h2>
        <div className="features">
          <article className="feature">
            <img src="/img/home/productos.png" alt="" />
            <h3>Elige un producto</h3>
            <p>
              Explora productos disponibles de nuestros aliados comerciales.
            </p>
          </article>
          <article className="feature">
            <img src="/img/home/condiciones.png" alt="" />
            <h3>Revisa las condiciones</h3>
            <p>Consulta modalidad, monto, plazo y tasa disponibles.</p>
          </article>
          <article className="feature">
            <img src="/img/home/evaluacion.png" alt="" />
            <h3>Conoce tu opción</h3>
            <p>
              Revisa tu precalificación y conoce las opciones para tu negocio.
            </p>
          </article>
          <article className="feature">
            <img src="/img/home/asesoria.png" alt="" />
            <h3>Continúa tu solicitud</h3>
            <p>Completa el proceso en línea con ayuda de un asesor.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
