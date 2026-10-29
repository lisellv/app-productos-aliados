import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFinanciamiento } from "../api/financiamientoApi";
import { apiProductos } from "../api/productosApi";
import { useAuth } from "../context/ContextoAutenticacion";
import type { Product } from "../types/modelos";

import type { ClientRecord, FinancingRequest } from "../types/modelos";

function etiquetaEstado(valorEstado?: string) {
  const etiquetas: Record<string, string> = {
    pendiente: "Pendiente",
    precalificado: "Precalificada",
    no_precalificado: "No precalificada",
    derivado: "Derivada",
    en_evaluacion: "En evaluación",
    aprobado: "Aprobada",
    rechazado: "Rechazada",
    cerrado: "Cerrada",
    cancelado: "Cancelada",
  };
  return etiquetas[valorEstado || ""] || valorEstado || "Sin estado";
}

export function RequestsPage() {
  const { estaAutenticado, esAdministrador } = useAuth();
  const [solicitudes, setSolicitudes] = useState<FinancingRequest[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [clientes, setClientes] = useState<ClientRecord[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const esVistaAdministrativa = esAdministrador;

  useEffect(() => {
    if (!estaAutenticado) {
      setCargando(false);
      setMensaje("Inicia sesión para consultar tus solicitudes.");
      return;
    }
    Promise.all([
      apiFinanciamiento.getRequests(),
      apiProductos.getAll().catch(() => [] as Product[]),
      esVistaAdministrativa
        ? apiFinanciamiento.getClients().catch(() => [])
        : Promise.resolve([]),
    ])
      .then(([solicitudesCargadas, productosCargados, clientesCargados]) => {
        setSolicitudes(
          Array.isArray(solicitudesCargadas) ? solicitudesCargadas : [],
        );
        setProductos(Array.isArray(productosCargados) ? productosCargados : []);
        setClientes(clientesCargados);
      })
      .catch((errorCapturado: unknown) => {
        const detalleError =
          errorCapturado instanceof Error
            ? errorCapturado.message
            : "No se pudieron cargar las solicitudes.";
        setMensaje(
          detalleError.includes("401") || detalleError.includes("403")
            ? "Inicia sesión con una cuenta autorizada para ver esta bandeja."
            : detalleError,
        );
      })
      .finally(() => setCargando(false));
  }, [estaAutenticado, esVistaAdministrativa]);

  const nombresProductoPorId = new Map(
    productos.map((producto) => [String(producto.id), producto.nombre]),
  );
  const clientesPorId = new Map(
    clientes.map((cliente) => [String(cliente.id), cliente]),
  );

  return (
    <main className="requests-page">
      <div className="requests-heading">
        <div>
          <h1>Bandeja de solicitudes</h1>
          <p>
            {!estaAutenticado
              ? mensaje
              : esVistaAdministrativa
                ? "Vista de administrador: todas las solicitudes activas."
                : "Estas son las solicitudes creadas desde tu cuenta."}
          </p>
        </div>
        <Link className="requests-new-link" to="/products">
          Nueva solicitud
        </Link>
      </div>
      {mensaje && estaAutenticado && (
        <p className="requests-message" role="status">
          {mensaje}
        </p>
      )}
      {!estaAutenticado && (
        <p className="requests-message" role="status">
          <Link to="/login">Iniciar sesión</Link>
        </p>
      )}
      <div className="requests-table-wrap">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Solicitud</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Plazo</th>
              <th>Precalificación</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={8}>Cargando solicitudes...</td>
              </tr>
            )}
            {!cargando && solicitudes.length === 0 && (
              <tr>
                <td colSpan={8}>No hay solicitudes para mostrar.</td>
              </tr>
            )}
            {!cargando &&
              solicitudes.map((solicitud) => {
                const cliente = clientesPorId.get(String(solicitud.clienteId));
                const nombreCliente = !esVistaAdministrativa
                  ? "Tu solicitud"
                  : !cliente
                    ? `Cliente #${solicitud.clienteId}`
                    : cliente.tipoPersona === "NATURAL"
                      ? `${cliente.nombres || ""} ${cliente.apellidos || ""}`.trim() ||
                        `Cliente #${solicitud.clienteId}`
                      : cliente.razonSocial ||
                        `Cliente #${solicitud.clienteId}`;
                const fecha = solicitud.creadoAt
                  ? new Date(solicitud.creadoAt).toLocaleDateString("es-PE")
                  : "—";
                return (
                  <tr key={solicitud.id}>
                    <td>#{solicitud.id}</td>
                    <td>{nombreCliente}</td>
                    <td>
                      {nombresProductoPorId.get(String(solicitud.productoId)) ||
                        `Producto #${solicitud.productoId}`}
                    </td>
                    <td>
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: solicitud.moneda || "PEN",
                      }).format(Number(solicitud.montoSolicitado) || 0)}
                    </td>
                    <td>{solicitud.plazoMeses} meses</td>
                    <td>
                      <span
                        className={`request-badge request-badge--${solicitud.resultadoPrecalificacion || "pendiente"}`}
                      >
                        {etiquetaEstado(solicitud.resultadoPrecalificacion)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`request-badge request-badge--${solicitud.estado || "pendiente"}`}
                      >
                        {etiquetaEstado(solicitud.estado)}
                      </span>
                    </td>
                    <td>
                      {Number.isNaN(
                        new Date(solicitud.creadoAt || "").getTime(),
                      )
                        ? "—"
                        : fecha}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
