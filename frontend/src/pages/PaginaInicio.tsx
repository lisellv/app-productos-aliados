import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-container landing-hero-layout">
          <div className="landing-hero-copy">
            <span className="landing-eyebrow landing-eyebrow--glass">
              TU PRÓXIMO PASO EMPIEZA AQUÍ
            </span>
            <h1>
              Haz crecer lo que ya estás <span>construyendo.</span>
            </h1>
            <p>
              Encuentra maquinaria, vehículos y tecnología para tu negocio. Te
              ayudamos a financiarlo de forma clara, rápida y a tu medida.
            </p>
            <div className="landing-hero-actions">
              <Link
                to="/products"
                className="landing-button landing-button--cyan"
              >
                Busca y solicita financiamiento{" "}
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/#proceso"
                className="landing-button landing-button--outline"
              >
                Conoce cómo funciona <span aria-hidden="true">⌄</span>
              </Link>
            </div>
            <div className="landing-assurance">
              <span className="assurance-dot" aria-hidden="true" />
              Opciones claras. Acompañamiento real.
            </div>
          </div>
          <div className="landing-hero-visual">
            <img
              className="landing-hero-image"
              src="https://www.bbva.pe/content/dam/public-web/peru/photos/blog-img/card/Card-dia-de-las-microempresas-y-las-pequenas-y-medianas-empresas.jpg"
              alt="Emprendedora atendiendo su negocio"
            />
            <div className="landing-image-caption">
              <div>
                <span>TU NEGOCIO, EN MOVIMIENTO</span>
                <strong>Más opciones. Más oportunidades.</strong>
              </div>
              <Link to="/products" aria-label="Explorar productos">
                →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-options" id="soluciones">
        <div className="landing-container">
          <div className="landing-section-heading landing-section-heading--split">
            <div>
              <span className="landing-eyebrow">SOLUCIONES PARA AVANZAR</span>
              <h2>Todo lo que necesitas para dar el siguiente paso.</h2>
            </div>
            <Link to="/products" className="landing-text-link">
              Ver todas las opciones <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="option-grid">
            <Link to="/products" className="option-card">
              <span className="option-icon">
                <img src="/img/home/productos.png" alt="" />
              </span>
              <h3>Maquinaria</h3>
              <p>Equipos que hacen crecer tu operación.</p>
              <span className="option-link">
                Explorar <span aria-hidden="true">→</span>
              </span>
            </Link>
            <Link to="/products" className="option-card option-card--featured">
              <span className="option-icon option-icon--featured">
                <img src="/img/home/condiciones.png" alt="" />
              </span>
              <h3>Vehículos</h3>
              <p>Movilidad para llegar más lejos.</p>
              <span className="option-link">
                Explorar <span aria-hidden="true">→</span>
              </span>
            </Link>
            <Link to="/products" className="option-card">
              <span className="option-icon">
                <img src="/img/home/evaluacion.png" alt="" />
              </span>
              <h3>Tecnología</h3>
              <p>Soluciones para trabajar mejor.</p>
              <span className="option-link">
                Explorar <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-benefits" id="beneficios">
        <div className="landing-container benefits-layout">
          <div className="benefits-copy">
            <span className="landing-eyebrow">
              FINANCIAMIENTO SIN COMPLICACIONES
            </span>
            <h2>Más claridad. Más control. Más negocio.</h2>
            <p>
              Creemos que financiar tu negocio debería ser tan simple como tener
              una buena idea. Hablamos claro desde el primer día.
            </p>
            <Link
              to="/products"
              className="landing-button landing-button--navy"
            >
              Quiero avanzar <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="benefit-grid">
            <article className="benefit-card">
              <span className="benefit-icon">
                <img src="/img/home/condiciones.png" alt="" />
              </span>
              <h3>Respuesta rápida</h3>
              <p>Sabe en poco tiempo si tu solicitud puede avanzar.</p>
            </article>
            <article className="benefit-card">
              <span className="benefit-icon">
                <img src="/img/home/productos.png" alt="" />
              </span>
              <h3>A tu medida</h3>
              <p>Opciones que se ajustan a la realidad de tu negocio.</p>
            </article>
            <article className="benefit-card">
              <span className="benefit-icon">
                <img src="/img/home/evaluacion.png" alt="" />
              </span>
              <h3>Proceso seguro</h3>
              <p>Tus datos y tu información siempre están protegidos.</p>
            </article>
            <article className="benefit-card">
              <span className="benefit-icon">
                <img src="/img/home/asesoria.png" alt="" />
              </span>
              <h3>Acompañamiento</h3>
              <p>
                Personas reales para resolver tus dudas cuando lo necesitas.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-process" id="proceso">
        <div className="landing-container">
          <div className="landing-section-heading landing-section-heading--center">
            <span className="landing-eyebrow">CÓMO FUNCIONA</span>
            <h2>De la idea a la acción, en tres pasos.</h2>
          </div>
          <div className="process-grid">
            <article className="process-step">
              <span>01</span>
              <h3>Explora</h3>
              <p>Encuentra el producto que tu negocio necesita.</p>
            </article>
            <article className="process-step">
              <span>02</span>
              <h3>Solicita</h3>
              <p>Cuéntanos cuánto necesitas y cómo podemos ayudarte.</p>
            </article>
            <article className="process-step">
              <span>03</span>
              <h3>Impulsa</h3>
              <p>Recibe una respuesta y continúa con tu solicitud.</p>
            </article>
          </div>
          <div className="landing-cta">
            <span className="landing-eyebrow landing-eyebrow--glass">
              EMPIEZA HOY
            </span>
            <h2>Tu próximo gran paso merece una buena oportunidad.</h2>
            <p>
              Cuéntanos qué necesitas para hacer crecer tu negocio y encontremos
              juntos el camino más conveniente.
            </p>
            <Link
              to="/products"
              className="landing-button landing-button--white"
            >
              Solicitar financiamiento <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
