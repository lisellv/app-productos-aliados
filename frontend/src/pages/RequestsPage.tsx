import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { financingApi } from "../api/financingApi";
import { productApi } from "../api/productApi";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";

import type { ClientRecord, FinancingRequest } from "../types";

function statusLabel(value?: string) {
  const labels: Record<string, string> = {
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
  return labels[value || ""] || value || "Sin estado";
}

export function RequestsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [requests, setRequests] = useState<FinancingRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const administrator = isAdmin;

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setMessage("Inicia sesión para consultar tus solicitudes.");
      return;
    }
    Promise.all([
      financingApi.getRequests(),
      productApi.getAll().catch(() => [] as Product[]),
      administrator
        ? financingApi.getClients().catch(() => [])
        : Promise.resolve([]),
    ])
      .then(([loadedRequests, loadedProducts, loadedClients]) => {
        setRequests(Array.isArray(loadedRequests) ? loadedRequests : []);
        setProducts(Array.isArray(loadedProducts) ? loadedProducts : []);
        setClients(loadedClients);
      })
      .catch((error: unknown) => {
        const detail =
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las solicitudes.";
        setMessage(
          detail.includes("401") || detail.includes("403")
            ? "Inicia sesión con una cuenta autorizada para ver esta bandeja."
            : detail,
        );
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, administrator]);

  const productsById = new Map(
    products.map((product) => [String(product.id), product.nombre]),
  );
  const clientsById = new Map(
    clients.map((client) => [String(client.id), client]),
  );

  return (
    <main className="requests-page">
      <div className="requests-heading">
        <div>
          <h1>Bandeja de solicitudes</h1>
          <p>
            {!isAuthenticated
              ? message
              : administrator
                ? "Vista de administrador: todas las solicitudes activas."
                : "Estas son las solicitudes creadas desde tu cuenta."}
          </p>
        </div>
        <Link className="requests-new-link" to="/products">
          Nueva solicitud
        </Link>
      </div>
      {message && isAuthenticated && (
        <p className="requests-message" role="status">
          {message}
        </p>
      )}
      {!isAuthenticated && (
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
            {loading && (
              <tr>
                <td colSpan={8}>Cargando solicitudes...</td>
              </tr>
            )}
            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={8}>No hay solicitudes para mostrar.</td>
              </tr>
            )}
            {!loading &&
              requests.map((request) => {
                const client = clientsById.get(String(request.clienteId));
                const clientName = !administrator
                  ? "Tu solicitud"
                  : !client
                    ? `Cliente #${request.clienteId}`
                    : client.tipoPersona === "NATURAL"
                      ? `${client.nombres || ""} ${client.apellidos || ""}`.trim() ||
                        `Cliente #${request.clienteId}`
                      : client.razonSocial || `Cliente #${request.clienteId}`;
                const date = request.creadoAt
                  ? new Date(request.creadoAt).toLocaleDateString("es-PE")
                  : "—";
                return (
                  <tr key={request.id}>
                    <td>#{request.id}</td>
                    <td>{clientName}</td>
                    <td>
                      {productsById.get(String(request.productoId)) ||
                        `Producto #${request.productoId}`}
                    </td>
                    <td>
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: request.moneda || "PEN",
                      }).format(Number(request.montoSolicitado) || 0)}
                    </td>
                    <td>{request.plazoMeses} meses</td>
                    <td>
                      <span
                        className={`request-badge request-badge--${request.resultadoPrecalificacion || "pendiente"}`}
                      >
                        {statusLabel(request.resultadoPrecalificacion)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`request-badge request-badge--${request.estado || "pendiente"}`}
                      >
                        {statusLabel(request.estado)}
                      </span>
                    </td>
                    <td>
                      {Number.isNaN(new Date(request.creadoAt || "").getTime())
                        ? "—"
                        : date}
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
