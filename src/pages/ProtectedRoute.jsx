import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function ProtectedRoute() {
    const { usuario, isAuthenticated, logout } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}



export default ProtectedRoute;