import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./components/AdminRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SiteLayout } from "./components/SiteLayout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AccountPage } from "./pages/AccountPage";
import { CartPage } from "./pages/CartPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MaintenancePage } from "./pages/MaintenancePage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { RequestsPage } from "./pages/RequestsPage";

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
