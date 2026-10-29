import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFinanciamiento } from "../api/financiamientoApi";
import { useCart } from "../context/ContextoCarrito";
import type { CartItem, FinancingOption } from "../types/modelos";
import { formatearMoneda, leerCarrito } from "../utils/carrito";

interface CondicionesSolicitud {
  idFinanciamiento: number;
  monto: string;
  plazo: string;
}

export function RegistrationPage() {
  const navegar = useNavigate();
  const { quitarArticulo } = useCart();
  const [carrito] = useState(leerCarrito);
  const [opcionesFinanciamiento, setOpcionesFinanciamiento] = useState<
    FinancingOption[]
  >([]);
  const [condicionesPorProducto, setCondicionesPorProducto] = useState<
    Record<string, CondicionesSolicitud>
  >({});
  const [tipoPersona, setTipoPersona] = useState("NATURAL");
  const [mensaje, setMensaje] = useState("Cargando productos y modalidades...");
  const [enviando, setEnviando] = useState(false);

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

  function cambiarCondiciones(articulo: CartItem, idFinanciamiento: number) {
    const modalidad = opcionesFinanciamiento.find(
      (opcion) => opcion.id === idFinanciamiento,
    );
    if (!modalidad) return;
    const montoEstimado = articulo.price * Math.max(1, articulo.quantity);
    setCondicionesPorProducto((anteriores) => ({
      ...anteriores,
      [String(articulo.id)]: {
        idFinanciamiento,
        monto: Math.min(
          Number(modalidad.montoMaximo),
          Math.max(Number(modalidad.montoMinimo), montoEstimado),
        ).toFixed(2),
        plazo: String(modalidad.plazoMinimoMeses),
      },
    }));
  }

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
        telefono: String(datosFormulario.get("telefono") || "").trim() || null,
      });

      for (const { articulo, condiciones, modalidad } of seleccionados) {
        const solicitud = await apiFinanciamiento.createRequest({
          clienteId: cliente.clienteId,
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
      sessionStorage.setItem(
        "tech-store-evaluation-result",
        JSON.stringify({
          resultadoPrecalificacion:
            solicitudesCreadas[0]?.resultadoPrecalificacion || "pendiente",
          producto: primerSeleccionado.articulo.name,
          montoSolicitado: primerSeleccionado.condiciones.monto,
          plazoMeses: primerSeleccionado.condiciones.plazo,
          solicitudIds: solicitudesCreadas.map(
            (solicitudCreada) => solicitudCreada.id,
          ),
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
          Completa los datos del cliente y las condiciones para cada producto.
        </p>
      </header>
      <form className="registration-form" onSubmit={enviarSolicitud}>
        <fieldset>
          <legend>Datos del cliente</legend>
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
                  <input name="nombres" type="text" maxLength={100} required />
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
        </fieldset>
        <section className="application-products-section">
          <h2>Productos y condiciones</h2>
          <div className="application-products">
            {carrito.length === 0 && (
              <p>
                No hay productos en el carrito.{" "}
                <Link to="/products">Explora el catálogo.</Link>
              </p>
            )}
            {mensaje && <p role="status">{mensaje}</p>}
            {carrito.map((articulo) => {
              const modalidades = opcionesFinanciamiento.filter(
                (modalidad) =>
                  String(modalidad.productoId) === String(articulo.id),
              );
              const condiciones = condicionesPorProducto[String(articulo.id)];
              const modalidad =
                modalidades.find(
                  (opcion) => opcion.id === condiciones?.idFinanciamiento,
                ) || modalidades[0];
              return (
                <article className="application-product" key={articulo.id}>
                  <h3>{articulo.name}</h3>
                  <p>
                    Precio referencial:{" "}
                    {formatearMoneda(articulo.price, articulo.currency)} ×{" "}
                    {Math.max(1, articulo.quantity)}
                  </p>
                  {!modalidades.length ? (
                    <p>
                      Este producto no tiene modalidades de financiamiento
                      activas.
                    </p>
                  ) : (
                    <>
                      <label>
                        Modalidad
                        <select
                          value={condiciones?.idFinanciamiento || modalidad.id}
                          onChange={(evento) =>
                            cambiarCondiciones(
                              articulo,
                              Number(evento.target.value),
                            )
                          }
                        >
                          {modalidades.map((opcion) => (
                            <option key={opcion.id} value={opcion.id}>
                              {opcion.tipoTasa}{" "}
                              {Number(opcion.tasaAnual).toFixed(2)}% anual
                            </option>
                          ))}
                        </select>
                      </label>
                      <p className="financing-summary">
                        {modalidad.tipoTasa}{" "}
                        {Number(modalidad.tasaAnual).toFixed(2)}% anual; monto{" "}
                        {formatearMoneda(
                          Number(modalidad.montoMinimo),
                          articulo.currency,
                        )}{" "}
                        a{" "}
                        {formatearMoneda(
                          Number(modalidad.montoMaximo),
                          articulo.currency,
                        )}
                        ; plazo {modalidad.plazoMinimoMeses} a{" "}
                        {modalidad.plazoMaximoMeses} meses.
                      </p>
                      <div className="registration-fields">
                        <label>
                          Monto solicitado
                          <input
                            type="number"
                            min={modalidad.montoMinimo}
                            max={modalidad.montoMaximo}
                            step="0.01"
                            required
                            value={condiciones?.monto || ""}
                            onChange={(evento) =>
                              setCondicionesPorProducto((anteriores) => ({
                                ...anteriores,
                                [String(articulo.id)]: {
                                  ...condiciones,
                                  idFinanciamiento: modalidad.id,
                                  monto: evento.target.value,
                                  plazo:
                                    condiciones?.plazo ||
                                    String(modalidad.plazoMinimoMeses),
                                },
                              }))
                            }
                          />
                        </label>
                        <label>
                          Plazo (meses)
                          <input
                            type="number"
                            min={modalidad.plazoMinimoMeses}
                            max={modalidad.plazoMaximoMeses}
                            step="1"
                            required
                            value={condiciones?.plazo || ""}
                            onChange={(evento) =>
                              setCondicionesPorProducto((anteriores) => ({
                                ...anteriores,
                                [String(articulo.id)]: {
                                  ...condiciones,
                                  idFinanciamiento: modalidad.id,
                                  monto: condiciones?.monto || "",
                                  plazo: evento.target.value,
                                },
                              }))
                            }
                          />
                        </label>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
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
