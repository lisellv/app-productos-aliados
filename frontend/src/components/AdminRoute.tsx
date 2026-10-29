import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AdminRoute() {
  const { canAccessManagement, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return canAccessManagement ? <Outlet /> : <Navigate to="/" replace />;
}
