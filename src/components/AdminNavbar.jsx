import { useNavigate, useLocation } from "react-router-dom";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoot = location.pathname === "/admin";

  return (
    <>
      <DolarCotizacion /> {/* Cotización arriba del menú */}
      <nav className="flex flex-col gap-2 mb-6 border-b pb-2">
        <span className="text-lg font-bold text-primary mb-2">
          Panel de Administrador
        </span>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 font-semibold rounded ${
              location.pathname.startsWith("/admin/productos")
                ? "bg-primary text-white"
                : "bg-gray-200"
            }`}
            onClick={() => navigate("/admin/productos")}
          >
            Productos
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded ${
              location.pathname.startsWith("/admin/categorias")
                ? "bg-primary text-white"
                : "bg-gray-200"
            }`}
            onClick={() => navigate("/admin/categorias")}
          >
            Categorías
          </button>
          {!isAdminRoot && (
            <button
              className="px-4 py-2 font-semibold rounded bg-gray-300"
              onClick={() => navigate("/admin")}
            >
              Volver a Admin
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
