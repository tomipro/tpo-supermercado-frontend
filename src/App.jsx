import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import PromotionsPage from "./pages/PromotionsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import CartPage from "./pages/CartPage";
import AdminPanelProductPage from "./pages/AdminPanelProductPage";
import BuscarPage from "./pages/BuscarPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPageLog from "./pages/ResetPasswordPageLog";
import ProductEditPage from "./pages/ProductEditPage";
import CategoryEditPage from "./pages/CategoryEditPage";
import AdminPanelCategoriesPage from "./pages/AdminPanelCategoriesPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-16 py-8">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/buscar" element={<BuscarPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/promociones" element={<PromotionsPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/cambiar-contrasena" element={<ResetPasswordPageLog />} />
            <Route path="/editar-producto/:id" element={<ProductEditPage modo="editar" />} />
            <Route path="/crear-producto" element={<ProductEditPage modo="crear" />} />
            <Route path="/editar-categoria/:id" element={<CategoryEditPage modo="editar" />} />
            <Route path="/crear-categoria" element={<CategoryEditPage modo="crear" />} />

            {/* Rutas de admin con layout */}
            <Route path="/admin" element={<AdminPage />}>
              <Route path="productos" element={<AdminPanelProductPage />} />
              <Route path="categorias" element={<AdminPanelCategoriesPage />} />
            </Route>
          </Route>

          {/* Ruta catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
