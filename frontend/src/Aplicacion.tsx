import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/EstructuraSitio";
import { AdminRoute } from "./components/RutaAdministracion";
import { ProtectedRoute } from "./components/RutaProtegida";
import { AuthProvider } from "./context/ContextoAutenticacion";
import { CartProvider } from "./context/ContextoCarrito";
import { CartPage } from "./pages/PaginaCarrito";
import { CategoriesPage } from "./pages/PaginaCategorias";
import { AccountPage } from "./pages/PaginaCuenta";
import { EvaluationPage } from "./pages/PaginaEvaluacion";
import { HomePage } from "./pages/PaginaInicio";
import { LoginPage } from "./pages/PaginaInicioSesion";
import { MaintenancePage } from "./pages/PaginaMantenimiento";
import { RegistrationPage } from "./pages/PaginaRegistroSolicitud";
import { RequestsPage } from "./pages/PaginaSolicitudes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SiteLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home.html" element={<HomePage />} />
              <Route path="/index.html" element={<HomePage />} />
              <Route path="/products" element={<CategoriesPage />} />
              <Route path="/categories.html" element={<CategoriesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login.html" element={<LoginPage />} />
              <Route path="/register" element={<AccountPage />} />
              <Route path="/signout.html" element={<AccountPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cart.html" element={<CartPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/requests/new" element={<RegistrationPage />} />
                <Route
                  path="/registro-solicitud.html"
                  element={<RegistrationPage />}
                />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/solicitudes.html" element={<RequestsPage />} />
                <Route path="/evaluation" element={<EvaluationPage />} />
                <Route
                  path="/resultado_evaluacion.html"
                  element={<EvaluationPage />}
                />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<MaintenancePage />} />
                <Route
                  path="/mantenimientos.html"
                  element={<MaintenancePage />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SiteLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
