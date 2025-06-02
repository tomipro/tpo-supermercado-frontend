import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet, useLocation } from "react-router-dom";

const colores = [
  "#8884d8",
  "#2563eb",
  "#ef4444",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

// Utilidad para agrupar ventas por día
function agruparVentasPorDia(ordenes) {
  const ventas = {};
  ordenes.forEach((orden) => {
    const fecha = orden.fecha.split("T")[0]; // yyyy-mm-dd
    ventas[fecha] = (ventas[fecha] || 0) + Number(orden.total);
  });
  return Object.entries(ventas).map(([fecha, ventasTotales]) => ({ fecha, ventasTotales }));
}

// Utilidad para agrupar ventas por mes
function agruparVentasPorMes(ordenes) {
  const ventas = {};
  ordenes.forEach((orden) => {
    const mes = orden.fecha.slice(0, 7); // yyyy-mm
    ventas[mes] = (ventas[mes] || 0) + Number(orden.total);
  });
  return Object.entries(ventas).map(([mes, ventasTotales]) => ({ mes, ventasTotales }));
}

// Proyección simple de ventas (pronóstico)
function calcularPronosticoVentas(ventasPorMes, mesesFuturos = 3) {
  if (ventasPorMes.length < 2) return [];
  const ultimos = ventasPorMes.slice(-2);
  const diff = ultimos[1].ventasTotales - ultimos[0].ventasTotales;
  const base = ultimos[1].ventasTotales;
  const baseMes = ultimos[1].mes;
  const resultado = [];
  let [anio, mes] = baseMes.split("-").map(Number);
  for (let i = 1; i <= mesesFuturos; i++) {
    mes++;
    if (mes > 12) {
      mes = 1;
      anio++;
    }
    resultado.push({
      mes: `${anio}-${mes.toString().padStart(2, "0")}`,
      ventasProyectadas: base + diff * i,
    });
  }
  return [
    ...ventasPorMes.map((v) => ({
      mes: v.mes,
      ventasReales: v.ventasTotales,
      ventasProyectadas: null,
    })),
    ...resultado,
  ];
}

export default function AdminPage() {
  const location = useLocation();
  const isAdminRoot = location.pathname === "/admin";

  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [pronosticoVentas, setPronosticoVentas] = useState([]);
  const [topProductosVendidos, setTopProductosVendidos] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVentas() {
      setLoading(true);
      // 1. Traer todos los usuarios
      const usuarios = await fetch("http://localhost:4040/usuarios").then(r => r.json());
      // 2. Traer todas las órdenes de todos los usuarios
      const ordenesPorUsuario = await Promise.all(
        usuarios.map(u =>
          fetch(`http://localhost:4040/usuarios/${u.id}/ordenes`).then(r => r.json())
        )
      );
      // 3. Unir todas las órdenes en un solo array
      const todasLasOrdenes = ordenesPorUsuario.flat();
      // 4. Agrupar ventas por día y por mes
      const ventasDia = agruparVentasPorDia(todasLasOrdenes);
      const ventasMes = agruparVentasPorMes(todasLasOrdenes);
      setVentasPorDia(ventasDia);
      setVentasPorMes(ventasMes);
      setPronosticoVentas(calcularPronosticoVentas(ventasMes, 3));
      setLoading(false);
    }
    async function fetchProductos() {
      const productos = await fetch("http://localhost:4040/producto").then(r => r.json());
      // Top productos más vendidos
      const productosOrdenados = [...productos]
        .sort((a, b) => (b.ventas_totales || 0) - (a.ventas_totales || 0))
        .slice(0, 10)
        .map(p => ({
          nombreProducto: p.nombre,
          unidadesVendidas: p.ventas_totales || 0,
        }));
      setTopProductosVendidos(productosOrdenados);

      // Productos con stock bajo
      const stockBajo = productos
        .filter(p => p.stock <= p.stock_minimo)
        .map(p => ({
          nombreProducto: p.nombre,
          stock: p.stock,
          stock_minimo: p.stock_minimo,
        }));
      setProductosStockBajo(stockBajo);
    }
    fetchVentas();
    fetchProductos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <AdminNavbar />
      {isAdminRoot && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ventas por Día */}
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold mb-2">Ventas por Día</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ventasPorDia}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventasTotales"
                  stroke={colores[1]}
                  name="Ventas Totales"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Ventas por Mes */}
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold mb-2">Ventas por Mes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ventasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar
                  dataKey="ventasTotales"
                  fill={colores[0]}
                  name="Ventas Totales"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pronóstico de Ventas */}
          <div className="bg-white rounded p-4 shadow col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-2">Pronóstico de Ventas</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={pronosticoVentas}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => value && `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventasReales"
                  stroke={colores[1]}
                  name="Ventas Reales"
                  dot={{ r: 4 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="ventasProyectadas"
                  stroke={colores[2]}
                  name="Proyección"
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Productos Vendidos */}
          <div className="bg-white rounded p-4 shadow col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-2">Top Productos Más Vendidos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={topProductosVendidos}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="nombreProducto" />
                <Tooltip formatter={(value) => `${value} u`} />
                <Bar dataKey="unidadesVendidas" fill={colores[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Productos con Stock Bajo */}
          <div className="bg-white rounded p-4 shadow col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-2">Productos con Stock Bajo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={productosStockBajo}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="nombreProducto" />
                <Tooltip formatter={(value) => `${value} unidades`} />
                <Bar dataKey="stock" fill={colores[4]} name="Stock Actual" />
                <Bar dataKey="stock_minimo" fill={colores[5]} name="Stock Mínimo" />
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