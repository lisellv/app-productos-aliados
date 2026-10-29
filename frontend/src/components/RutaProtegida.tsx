import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/ContextoAutenticacion";

export function ProtectedRoute() {
  const { estaAutenticado } = useAuth();
  const ubicacion = useLocation();

  return estaAutenticado ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: ubicacion.pathname }} />
  );
}
