import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function AdminPage() {
  const location = useLocation();

  // Mostrar gráficos solo en /admin (no en subrutas)
  const isAdminRoot = location.pathname === "/admin";

  const ventasPorMes = [
    { name: "Ene", Ventas: 120 },
    { name: "Feb", Ventas: 90 },
    { name: "Mar", Ventas: 150 },
    { name: "Abr", Ventas: 80 },
    { name: "May", Ventas: 200 },
  ];
  const stockPorCategoria = [
    { name: "Lácteos", Stock: 80 },
    { name: "Bebidas", Stock: 120 },
    { name: "Carnes", Stock: 60 },
    { name: "Verduras", Stock: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <AdminNavbar />
      {isAdminRoot && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Ventas por Mes */}
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold mb-2">Ventas por Mes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ventasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ventas" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Gráfico de Stock por Categoría */}
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold mb-2">Stock por Categoría</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Stock" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}