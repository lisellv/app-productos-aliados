import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFinanciamiento } from "../api/financiamientoApi";
import { useCart } from "../context/ContextoCarrito";
import type { ClientRecord, FinancingOption } from "../types/modelos";
import {
  calcularTotalSolicitado,
  formatearMoneda,
  leerCarrito,
} from "../utils/carrito";

interface CondicionesSolicitud {
  idFinanciamiento: number;
  monto: string;
  plazo: string;
}

interface CreditoSeleccionado {
  nombre: string;
  entidad: string;
  monto: number;
  moneda: string;
  tipoTasa: string;
  tasaAnual: number;
  plazoMinimoMeses: number;
  plazoMaximoMeses: number;
}

interface EstadoNavegacionSolicitud {
  creditoSeleccionado?: CreditoSeleccionado | null;
}

export function RegistrationPage() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const creditoSeleccionado = (
    ubicacion.state as EstadoNavegacionSolicitud | null
  )?.creditoSeleccionado;
  const { quitarArticulo } = useCart();
  const [carrito] = useState(leerCarrito);
  const subtotalPorMoneda = carrito.reduce<Record<string, number>>(
    (totales, articulo) => {
      const moneda = articulo.currency || "PEN";
      totales[moneda] =
        (totales[moneda] || 0) +
        articulo.price * Math.max(1, articulo.quantity);
      return totales;
    },
    {},
  );
  const subtotalProductos = Object.values(subtotalPorMoneda).reduce(
    (subtotal, importe) => subtotal + importe,
    0,
  );
  const subtotalFormateado =
    Object.entries(subtotalPorMoneda)
      .map(([moneda, importe]) => formatearMoneda(importe, moneda))
      .join(" · ") || formatearMoneda(0);
  const montoCredito = creditoSeleccionado?.monto || 0;
  const totalSolicitado = calcularTotalSolicitado(
    subtotalProductos,
    montoCredito,
  );
  const monedaSolicitud =
    creditoSeleccionado?.moneda || carrito[0]?.currency || "PEN";
  const [opcionesFinanciamiento, setOpcionesFinanciamiento] = useState<
    FinancingOption[]
  >([]);
  const [perfilCliente, setPerfilCliente] = useState<ClientRecord | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [errorPerfil, setErrorPerfil] = useState("");
  const [condicionesPorProducto, setCondicionesPorProducto] = useState<
    Record<string, CondicionesSolicitud>
  >({});
  const [tipoPersona, setTipoPersona] = useState("NATURAL");
  const [mensaje, setMensaje] = useState("Preparando productos...");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let solicitudVigente = true;
    apiFinanciamiento
      .obtenerMiPerfil()
      .then((perfil) => {
        if (!solicitudVigente) return;
        setPerfilCliente(perfil);
        if (perfil) setTipoPersona(perfil.tipoPersona);
      })
      .catch((errorCapturado: unknown) => {
        if (solicitudVigente) {
          setErrorPerfil(
            errorCapturado instanceof Error
              ? errorCapturado.message
              : "No se pudieron consultar tus datos guardados.",
          );
        }
      })
      .finally(() => {
        if (solicitudVigente) setCargandoPerfil(false);
      });

    return () => {
      solicitudVigente = false;
    };
  }, []);

  useEffect(() => {
    if (carrito.length === 0) {
      setMensaje("");
      return;
    }
    apiFinanciamiento
      .getOptions()
      .then((opciones) => {
        const fechaActual = new Date().toISOString().slice(0, 10);
        const opcionesVigentes = opciones.filter(
          (modalidad) =>
            modalidad.activo !== false &&
            (!modalidad.vigenteDesde ||
              modalidad.vigenteDesde <= fechaActual) &&
            (!modalidad.vigenteHasta || modalidad.vigenteHasta >= fechaActual),
        );
        setOpcionesFinanciamiento(opcionesVigentes);
        const condicionesIniciales: Record<string, CondicionesSolicitud> = {};
        carrito.forEach((articulo) => {
          const modalidad = opcionesVigentes.find(
            (opcion) => String(opcion.productoId) === String(articulo.id),
          );
          if (modalidad) {
            const montoEstimado =
              articulo.price * Math.max(1, articulo.quantity);
            condicionesIniciales[String(articulo.id)] = {
              idFinanciamiento: modalidad.id,
              monto: Math.min(
                Number(modalidad.montoMaximo),
                Math.max(Number(modalidad.montoMinimo), montoEstimado),
              ).toFixed(2),
              plazo: String(modalidad.plazoMinimoMeses),
            };
          }
        });
        setCondicionesPorProducto(condicionesIniciales);
        setMensaje("");
      })
      .catch((errorCapturado: unknown) => {
        setMensaje(
          errorCapturado instanceof Error
            ? errorCapturado.message
            : "No se pudieron cargar las modalidades.",
        );
      });
  }, [carrito]);

  async function enviarSolicitud(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje("");
    const datosFormulario = new FormData(evento.currentTarget);
    const opcionesPorId = new Map(
      opcionesFinanciamiento.map((modalidad) => [modalidad.id, modalidad]),
    );
    const seleccionados = carrito.map((articulo) => ({
      articulo,
      condiciones: condicionesPorProducto[String(articulo.id)],
      modalidad: opcionesPorId.get(
        condicionesPorProducto[String(articulo.id)]?.idFinanciamiento,
      ),
    }));
    if (
      !seleccionados.length ||
      seleccionados.some(
        (seleccion) => !seleccion.modalidad || !seleccion.condiciones,
      )
    ) {
      setMensaje(
        "Agrega productos con modalidades disponibles antes de continuar.",
      );
      return;
    }
    for (const { articulo, condiciones, modalidad } of seleccionados) {
      const monto = Number(condiciones.monto);
      const plazo = Number(condiciones.plazo);
      if (
        monto < Number(modalidad!.montoMinimo) ||
        monto > Number(modalidad!.montoMaximo)
      ) {
        setMensaje(
          `El monto de ${articulo.name} está fuera del rango permitido.`,
        );
        return;
      }
      if (
        plazo < modalidad!.plazoMinimoMeses ||
        plazo > modalidad!.plazoMaximoMeses
      ) {
        setMensaje(
          `El plazo de ${articulo.name} está fuera del rango permitido.`,
        );
        return;
      }
    }

    setEnviando(true);
    const solicitudesCreadas: Array<{
      id: number | string;
      resultadoPrecalificacion?: string;
    }> = [];
    try {
      let clienteId: number;
      if (perfilCliente) {
        clienteId = Number(perfilCliente.id);
      } else {
        const esPersonaNatural = tipoPersona === "NATURAL";
        const cliente = await apiFinanciamiento.registerClient({
          tipoPersona,
          tipoDocumento: String(datosFormulario.get("tipoDocumento") || ""),
          numeroDocumento: String(
            datosFormulario.get("numeroDocumento") || "",
          ).trim(),
          nombres: esPersonaNatural
            ? String(datosFormulario.get("nombres") || "").trim()
            : null,
          apellidos: esPersonaNatural
            ? String(datosFormulario.get("apellidos") || "").trim()
            : null,
          razonSocial: esPersonaNatural
            ? null
            : String(datosFormulario.get("razonSocial") || "").trim(),
          correo: String(datosFormulario.get("correo") || "").trim() || null,
          telefono:
            String(datosFormulario.get("telefono") || "").trim() || null,
        });
        clienteId = cliente.clienteId;
      }

      for (const { articulo, condiciones, modalidad } of seleccionados) {
        const solicitud = await apiFinanciamiento.createRequest({
          clienteId,
          productoId: Number(articulo.id),
          productoFinanciamientoId: modalidad!.id,
          montoSolicitado: Number(condiciones.monto),
          plazoMeses: Number(condiciones.plazo),
          tasaTipoAplicada: modalidad!.tipoTasa,
          tasaAnualAplicada: modalidad!.tasaAnual,
          consentimiento: datosFormulario.get("consentimiento") === "on",
        });
        solicitudesCreadas.push(solicitud);
        quitarArticulo(articulo.id);
      }

      const primerSeleccionado = seleccionados[0];
      const resultadoPrecalificacionSimulado =
        Math.random() < 0.5 ? "precalificado" : "no_precalificado";
      sessionStorage.setItem(
        "tech-store-evaluation-result",
        JSON.stringify({
          resultadoPrecalificacion: resultadoPrecalificacionSimulado,
          resultadoSimulado: true,
          producto: primerSeleccionado.articulo.name,
          montoSolicitado: primerSeleccionado.condiciones.monto,
          plazoMeses: primerSeleccionado.condiciones.plazo,
          solicitudIds: solicitudesCreadas.map(
            (solicitudCreada) => solicitudCreada.id,
          ),
          resumenSolicitud: {
            productos: carrito.map((articulo) => ({
              nombre: articulo.name,
              cantidad: Math.max(1, articulo.quantity),
              precioUnitario: articulo.price,
              subtotal: articulo.price * Math.max(1, articulo.quantity),
              moneda: articulo.currency || "PEN",
            })),
            subtotalPorMoneda,
            creditoSeleccionado: creditoSeleccionado || null,
            totalSolicitado,
            moneda: monedaSolicitud,
          },
        }),
      );
      navegar("/evaluation");
    } catch (errorCapturado) {
      const detalleError =
        errorCapturado instanceof Error
          ? errorCapturado.message
          : "Ocurrió un error inesperado.";
      setMensaje(
        solicitudesCreadas.length
          ? `Se registraron ${solicitudesCreadas.length} solicitud(es). ${detalleError}`
          : detalleError,
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="request-registration">
      <header className="registration-heading">
        <h1>Registrar solicitud de financiamiento</h1>
        <p>
          Revisa el resumen de tu carrito y confirma tus datos para enviar la
          solicitud.
        </p>
      </header>
      <form className="registration-form" onSubmit={enviarSolicitud}>
        <fieldset>
          <legend>Datos del cliente</legend>
          {cargandoPerfil ? (
            <p role="status">Consultando los datos de tu cuenta...</p>
          ) : errorPerfil ? (
            <p role="alert">{errorPerfil}</p>
          ) : perfilCliente ? (
            <div className="customer-profile-summary">
              <span>Usaremos los datos asociados a tu cuenta.</span>
              <strong>
                {perfilCliente.tipoPersona === "NATURAL"
                  ? `${perfilCliente.nombres || ""} ${perfilCliente.apellidos || ""}`.trim()
                  : perfilCliente.razonSocial}
              </strong>
              <span>
                {perfilCliente.tipoDocumento} {perfilCliente.numeroDocumento}
              </span>
              {perfilCliente.correo && <span>{perfilCliente.correo}</span>}
              {perfilCliente.telefono && <span>{perfilCliente.telefono}</span>}
            </div>
          ) : (
            <div className="registration-fields">
              <label>
                Tipo de persona
                <select
                  name="tipoPersona"
                  value={tipoPersona}
                  onChange={(evento) => setTipoPersona(evento.target.value)}
                >
                  <option value="NATURAL">Persona natural</option>
                  <option value="JURIDICA">Persona jurídica</option>
                </select>
              </label>
              <label>
                Tipo de documento
                <select name="tipoDocumento">
                  {tipoPersona === "NATURAL" ? (
                    <>
                      <option value="DNI">DNI</option>
                      <option value="CE">Carné de extranjería</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </>
                  ) : (
                    <option value="RUC">RUC</option>
                  )}
                </select>
              </label>
              <label>
                Número de documento
                <input
                  name="numeroDocumento"
                  type="text"
                  maxLength={11}
                  required
                />
              </label>
              {tipoPersona === "NATURAL" ? (
                <>
                  <label>
                    Nombres
                    <input
                      name="nombres"
                      type="text"
                      maxLength={100}
                      required
                    />
                  </label>
                  <label>
                    Apellidos
                    <input
                      name="apellidos"
                      type="text"
                      maxLength={100}
                      required
                    />
                  </label>
                </>
              ) : (
                <label>
                  Razón social
                  <input
                    name="razonSocial"
                    type="text"
                    maxLength={150}
                    required
                  />
                </label>
              )}
              <label>
                Correo electrónico
                <input name="correo" type="email" maxLength={254} />
              </label>
              <label>
                Teléfono
                <input name="telefono" type="tel" maxLength={20} />
              </label>
            </div>
          )}
        </fieldset>
        <section className="application-products-section">
          <h2>Resumen de la solicitud</h2>
          {creditoSeleccionado && (
            <article className="selected-bank-credit">
              <div>
                <span>Crédito bancario seleccionado</span>
                <h3>{creditoSeleccionado.nombre}</h3>
                <p>{creditoSeleccionado.entidad}</p>
              </div>
              <div className="selected-bank-credit-terms">
                <span>Monto a financiar</span>
                <strong>
                  {formatearMoneda(
                    creditoSeleccionado.monto,
                    creditoSeleccionado.moneda,
                  )}
                </strong>
                <p>
                  {creditoSeleccionado.tipoTasa === "TEA"
                    ? "Tasa efectiva anual (TEA)"
                    : creditoSeleccionado.tipoTasa === "TNA"
                      ? "Tasa nominal anual (TNA)"
                      : creditoSeleccionado.tipoTasa}
                  : {Number(creditoSeleccionado.tasaAnual).toFixed(2)}% anual
                </p>
                <p>
                  Plazo disponible: {creditoSeleccionado.plazoMinimoMeses} a{" "}
                  {creditoSeleccionado.plazoMaximoMeses} meses
                </p>
              </div>
            </article>
          )}
          <h3 className="application-products-subtitle">
            Productos solicitados
          </h3>
          <div className="application-products">
            {carrito.length === 0 && (
              <p>
                No hay productos en el carrito.{" "}
                <Link to="/products">Explora el catálogo.</Link>
              </p>
            )}
            {mensaje && <p role="status">{mensaje}</p>}
            {carrito.map((articulo) => (
              <article className="application-product" key={articulo.id}>
                <h3>
                  {articulo.name}
                  {articulo.quantity > 1 && ` × ${articulo.quantity}`}
                </h3>
                <div className="application-product-summary">
                  <span>Precio unitario</span>
                  <strong>
                    {formatearMoneda(articulo.price, articulo.currency)}
                  </strong>
                </div>
              </article>
            ))}
          </div>
          <div className="application-summary-breakdown" aria-live="polite">
            <div className="application-summary-line">
              <span>Subtotal de productos</span>
              <strong>{subtotalFormateado}</strong>
            </div>
            <div className="application-summary-line">
              <span>Monto a financiar</span>
              <strong>
                {creditoSeleccionado
                  ? formatearMoneda(
                      creditoSeleccionado.monto,
                      creditoSeleccionado.moneda,
                    )
                  : "Sin crédito seleccionado"}
              </strong>
            </div>
            <div className="application-summary-total">
              <span>Total solicitado</span>
              <strong>
                {formatearMoneda(totalSolicitado, monedaSolicitud)}
              </strong>
            </div>
          </div>
        </section>
        <label className="request-consent">
          <input type="checkbox" name="consentimiento" required />
          Autorizo el tratamiento de mis datos personales y su uso para
          gestionar esta solicitud.
        </label>
        <div className="registration-actions">
          <Link className="admin-form-cancel" to="/cart">
            Volver al carrito
          </Link>
          <button
            className="confirm-btn"
            type="submit"
            disabled={
              enviando ||
              cargandoPerfil ||
              Boolean(errorPerfil) ||
              !carrito.length ||
              carrito.some(
                (articulo) =>
                  !opcionesFinanciamiento.some(
                    (modalidad) =>
                      String(modalidad.productoId) === String(articulo.id),
                  ),
              )
            }
          >
            {enviando ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>
      </form>
    </main>
  );
}
