import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/ContextoAutenticacion";

export function AdminRoute() {
  const { puedeAdministrar, estaAutenticado } = useAuth();
  if (!estaAutenticado) return <Navigate to="/login" replace />;
  return puedeAdministrar ? <Outlet /> : <Navigate to="/" replace />;
}
