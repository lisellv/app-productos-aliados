import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { financingApi } from "../api/financingApi";
import { useCart } from "../context/CartContext";
import type { CartItem, FinancingOption } from "../types";
import { formatMoney, readCart } from "../utils/cart";

interface ApplicationTerms {
  financingId: number;
  amount: string;
  term: string;
}

export function RegistrationPage() {
  const navigate = useNavigate();
  const { removeItem } = useCart();
  const [cart] = useState(readCart);
  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>(
    [],
  );
  const [terms, setTerms] = useState<Record<string, ApplicationTerms>>({});
  const [personType, setPersonType] = useState("NATURAL");
  const [message, setMessage] = useState("Cargando productos y modalidades...");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      setMessage("");
      return;
    }
    financingApi
      .getOptions()
      .then((result) => {
        const today = new Date().toISOString().slice(0, 10);
        const activeOptions = result.filter(
          (item) =>
            item.activo !== false &&
            (!item.vigenteDesde || item.vigenteDesde <= today) &&
            (!item.vigenteHasta || item.vigenteHasta >= today),
        );
        setFinancingOptions(activeOptions);
        const initialTerms: Record<string, ApplicationTerms> = {};
        cart.forEach((item) => {
          const option = activeOptions.find(
            (entry) => String(entry.productoId) === String(item.id),
          );
          if (option) {
            const estimate = item.price * Math.max(1, item.quantity);
            initialTerms[String(item.id)] = {
              financingId: option.id,
              amount: Math.min(
                Number(option.montoMaximo),
                Math.max(Number(option.montoMinimo), estimate),
              ).toFixed(2),
              term: String(option.plazoMinimoMeses),
            };
          }
        });
        setTerms(initialTerms);
        setMessage("");
      })
      .catch((error: unknown) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las modalidades.",
        );
      });
  }, [cart]);

  function changeTerms(item: CartItem, financingId: number) {
    const option = financingOptions.find((entry) => entry.id === financingId);
    if (!option) return;
    const estimate = item.price * Math.max(1, item.quantity);
    setTerms((current) => ({
      ...current,
      [String(item.id)]: {
        financingId,
        amount: Math.min(
          Number(option.montoMaximo),
          Math.max(Number(option.montoMinimo), estimate),
        ).toFixed(2),
        term: String(option.plazoMinimoMeses),
      },
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const optionsById = new Map(
      financingOptions.map((option) => [option.id, option]),
    );
    const selected = cart.map((item) => ({
      item,
      terms: terms[String(item.id)],
      option: optionsById.get(terms[String(item.id)]?.financingId),
    }));
    if (
      !selected.length ||
      selected.some((entry) => !entry.option || !entry.terms)
    ) {
      setMessage(
        "Agrega productos con modalidades disponibles antes de continuar.",
      );
      return;
    }
    for (const { item, terms: selectedTerms, option } of selected) {
      const amount = Number(selectedTerms.amount);
      const term = Number(selectedTerms.term);
      if (
        amount < Number(option!.montoMinimo) ||
        amount > Number(option!.montoMaximo)
      ) {
        setMessage(`El monto de ${item.name} está fuera del rango permitido.`);
        return;
      }
      if (term < option!.plazoMinimoMeses || term > option!.plazoMaximoMeses) {
        setMessage(`El plazo de ${item.name} está fuera del rango permitido.`);
        return;
      }
    }

    setSubmitting(true);
    const createdRequests: Array<{
      id: number | string;
      resultadoPrecalificacion?: string;
    }> = [];
    try {
      const natural = personType === "NATURAL";
      const client = await financingApi.registerClient({
        tipoPersona: personType,
        tipoDocumento: String(formData.get("tipoDocumento") || ""),
        numeroDocumento: String(formData.get("numeroDocumento") || "").trim(),
        nombres: natural ? String(formData.get("nombres") || "").trim() : null,
        apellidos: natural
          ? String(formData.get("apellidos") || "").trim()
          : null,
        razonSocial: natural
          ? null
          : String(formData.get("razonSocial") || "").trim(),
        correo: String(formData.get("correo") || "").trim() || null,
        telefono: String(formData.get("telefono") || "").trim() || null,
      });

      for (const { item, terms: selectedTerms, option } of selected) {
        const request = await financingApi.createRequest({
          clienteId: client.clienteId,
          productoId: Number(item.id),
          productoFinanciamientoId: option!.id,
          montoSolicitado: Number(selectedTerms.amount),
          plazoMeses: Number(selectedTerms.term),
          tasaTipoAplicada: option!.tipoTasa,
          tasaAnualAplicada: option!.tasaAnual,
          consentimiento: formData.get("consentimiento") === "on",
        });
        createdRequests.push(request);
        removeItem(item.id);
      }

      const first = selected[0];
      sessionStorage.setItem(
        "tech-store-evaluation-result",
        JSON.stringify({
          resultadoPrecalificacion:
            createdRequests[0]?.resultadoPrecalificacion || "pendiente",
          producto: first.item.name,
          montoSolicitado: first.terms.amount,
          plazoMeses: first.terms.term,
          solicitudIds: createdRequests.map(
            (createdRequest) => createdRequest.id,
          ),
        }),
      );
      navigate("/evaluation");
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      setMessage(
        createdRequests.length
          ? `Se registraron ${createdRequests.length} solicitud(es). ${detail}`
          : detail,
      );
    } finally {
      setSubmitting(false);
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
      <form className="registration-form" onSubmit={submit}>
        <fieldset>
          <legend>Datos del cliente</legend>
          <div className="registration-fields">
            <label>
              Tipo de persona
              <select
                name="tipoPersona"
                value={personType}
                onChange={(event) => setPersonType(event.target.value)}
              >
                <option value="NATURAL">Persona natural</option>
                <option value="JURIDICA">Persona jurídica</option>
              </select>
            </label>
            <label>
              Tipo de documento
              <select name="tipoDocumento">
                {personType === "NATURAL" ? (
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
            {personType === "NATURAL" ? (
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
            {cart.length === 0 && (
              <p>
                No hay productos en el carrito.{" "}
                <Link to="/products">Explora el catálogo.</Link>
              </p>
            )}
            {message && <p role="status">{message}</p>}
            {cart.map((item) => {
              const options = financingOptions.filter(
                (option) => String(option.productoId) === String(item.id),
              );
              const selectedTerms = terms[String(item.id)];
              const option =
                options.find(
                  (entry) => entry.id === selectedTerms?.financingId,
                ) || options[0];
              return (
                <article className="application-product" key={item.id}>
                  <h3>{item.name}</h3>
                  <p>
                    Precio referencial: {formatMoney(item.price, item.currency)}{" "}
                    × {Math.max(1, item.quantity)}
                  </p>
                  {!options.length ? (
                    <p>
                      Este producto no tiene modalidades de financiamiento
                      activas.
                    </p>
                  ) : (
                    <>
                      <label>
                        Modalidad
                        <select
                          value={selectedTerms?.financingId || option.id}
                          onChange={(event) =>
                            changeTerms(item, Number(event.target.value))
                          }
                        >
                          {options.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.tipoTasa}{" "}
                              {Number(entry.tasaAnual).toFixed(2)}% anual
                            </option>
                          ))}
                        </select>
                      </label>
                      <p className="financing-summary">
                        {option.tipoTasa} {Number(option.tasaAnual).toFixed(2)}%
                        anual; monto{" "}
                        {formatMoney(Number(option.montoMinimo), item.currency)}{" "}
                        a{" "}
                        {formatMoney(Number(option.montoMaximo), item.currency)}
                        ; plazo {option.plazoMinimoMeses} a{" "}
                        {option.plazoMaximoMeses} meses.
                      </p>
                      <div className="registration-fields">
                        <label>
                          Monto solicitado
                          <input
                            type="number"
                            min={option.montoMinimo}
                            max={option.montoMaximo}
                            step="0.01"
                            required
                            value={selectedTerms?.amount || ""}
                            onChange={(event) =>
                              setTerms((current) => ({
                                ...current,
                                [String(item.id)]: {
                                  ...selectedTerms,
                                  financingId: option.id,
                                  amount: event.target.value,
                                  term:
                                    selectedTerms?.term ||
                                    String(option.plazoMinimoMeses),
                                },
                              }))
                            }
                          />
                        </label>
                        <label>
                          Plazo (meses)
                          <input
                            type="number"
                            min={option.plazoMinimoMeses}
                            max={option.plazoMaximoMeses}
                            step="1"
                            required
                            value={selectedTerms?.term || ""}
                            onChange={(event) =>
                              setTerms((current) => ({
                                ...current,
                                [String(item.id)]: {
                                  ...selectedTerms,
                                  financingId: option.id,
                                  amount: selectedTerms?.amount || "",
                                  term: event.target.value,
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
              submitting ||
              !cart.length ||
              cart.some(
                (item) =>
                  !financingOptions.some(
                    (option) => String(option.productoId) === String(item.id),
                  ),
              )
            }
          >
            {submitting ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>
      </form>
    </main>
  );
}
