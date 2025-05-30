import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import PromotionsPage from "./pages/PromotionsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import CartPage from "./pages/CartPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import BuscarPage from "./pages/BuscarPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPageLog from "./pages/ResetPasswordPageLog";
import ProductDetailPage from "./pages/ProductDetailPage";
import MisPedidosPage from "./pages/MisPedidosPage";
import PedidoDetallePage from "./pages/PedidoDetallePage";
import "./App.css";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-16 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buscar" element={<BuscarPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/promociones" element={<PromotionsPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/producto/:slug" element={<ProductDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/mis-pedidos" element={<MisPedidosPage />} />
            <Route path="/mis-pedidos/:id" element={<PedidoDetallePage />} />
            <Route
              path="/cambiar-contrasena"
              element={<ResetPasswordPageLog />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
