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
import { useAuth } from "../auth/AuthProvider";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchProductos } from "../redux/productosSlice";
import { fetchUsuarios } from "../redux/usuarioSlice";

const colores = [
  "#8884d8",
  "#2563eb",
  "#ef4444",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

// Utilidad para agrupar ventas por día usando fechaCreacion
function agruparVentasPorDia(ordenes) {
  const ventas = {};
  ordenes.forEach((orden) => {
    const fechaRaw = orden.fechaCreacion || orden.fecha;
    if (!fechaRaw) return;
    const fecha = String(fechaRaw).split("T")[0]; // yyyy-mm-dd
    ventas[fecha] = (ventas[fecha] || 0) + Number(orden.total);
  });
  return Object.entries(ventas)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, ventasTotales]) => ({ fecha, ventasTotales }));
}

// Utilidad para agrupar ventas por mes usando fechaCreacion
function agruparVentasPorMes(ordenes) {
  const ventas = {};
  ordenes.forEach((orden) => {
    const fechaRaw = orden.fechaCreacion || orden.fecha;
    if (!fechaRaw) return;
    const mes = String(fechaRaw).slice(0, 7); // yyyy-mm
    ventas[mes] = (ventas[mes] || 0) + Number(orden.total);
  });
  return Object.entries(ventas)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, ventasTotales]) => ({ mes, ventasTotales }));
}

// Proyección simple de ventas (pronóstico)
function calcularPronosticoVentas(ventasPorMes, mesesFuturos = 3) {
  if (!Array.isArray(ventasPorMes) || ventasPorMes.length === 0) return [];
  // Si hay solo un mes, no se puede proyectar, pero igual mostrar ese mes como real
  if (ventasPorMes.length === 1) {
    return [
      {
        mes: ventasPorMes[0].mes,
        ventasReales: ventasPorMes[0].ventasTotales,
        ventasProyectadas: null,
      },
    ];
  }
  // Si hay más de uno, proyectar usando la diferencia promedio de los últimos N meses
  const n = Math.min(ventasPorMes.length, 3);
  const ultimos = ventasPorMes.slice(-n);
  const diffs = [];
  for (let i = 1; i < ultimos.length; i++) {
    diffs.push(ultimos[i].ventasTotales - ultimos[i - 1].ventasTotales);
  }
  const diffProm =
    diffs.length > 0 ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
  const base = ultimos[ultimos.length - 1].ventasTotales;
  const baseMes = ultimos[ultimos.length - 1].mes;
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
      ventasReales: null,
      ventasProyectadas: Math.round(base + diffProm * i),
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

// Contar productos vendidos en todas las órdenes
function contarProductosVendidos(ordenes) {
  // Devuelve un array [{ productoId, nombreProducto, unidadesVendidas }]
  const conteo = {};
  ordenes.forEach((orden) => {
    if (!orden.items || !Array.isArray(orden.items)) return;
    orden.items.forEach((item) => {
      if (!item.productoId) return;
      if (!conteo[item.productoId]) {
        conteo[item.productoId] = {
          productoId: item.productoId,
          nombreProducto:
            item.nombreProducto || item.nombre || `ID ${item.productoId}`,
          unidadesVendidas: 0,
        };
      }
      conteo[item.productoId].unidadesVendidas += Number(item.cantidad) || 0;
    });
  });
  // Ordenar por unidadesVendidas desc
  return Object.values(conteo).sort(
    (a, b) => b.unidadesVendidas - a.unidadesVendidas
  );
}

// Productos con stock bajo (menos de 10)
function productosConStockBajo(productos) {
  if (!Array.isArray(productos)) return [];
  return productos
    .filter((p) => typeof p.stock === "number" && p.stock < 10)
    .map((p) => ({
      nombreProducto: p.nombre || p.name || `ID ${p.id}`,
      stock: p.stock,
      stock_minimo: p.stock_minimo || 10,
    }))
    .sort((a, b) => a.stock - b.stock);
}

export default function AdminPage() {
  const location = useLocation();
  const isAdminRoot = location.pathname === "/admin";
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [pronosticoVentas, setPronosticoVentas] = useState([]);
  const [topProductosVendidos, setTopProductosVendidos] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalOrdenes, setTotalOrdenes] = useState(null);

  useEffect(() => {
    async function fetchVentas() {
      setLoading(true);
      setError("");
      try {
        // 1. Traer todos los usuarios (con token)
        const usuariosRes = await dispatch(fetchUsuarios());
        if (!usuariosRes.status === 200)
          throw new Error("No autorizado o error al cargar usuarios.");
        const usuarios = usuariosRes.data;
        if (!Array.isArray(usuarios) || usuarios.length === 0) {
          setVentasPorDia([]);
          setVentasPorMes([]);
          setPronosticoVentas([]);
          setTotalOrdenes(0);
          setLoading(false);
          return;
        }
        // 2. Traer todas las órdenes de todos los usuarios (manejar errores individuales y 404/500)
        const ordenesPorUsuario = await Promise.all(
          usuarios.map(async (u) => {
            try {
              const r = await axios.get(
                `http://localhost:4040/usuarios/${u.id}/ordenes`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (r.status !== 200) return [];
              // Si la respuesta es vacía o error 500, devolver []
              let data = null;
              try {
                data = r.data;
              } catch {
                return [];
              }
              if (Array.isArray(data)) return data;
              if (data && Array.isArray(data.content)) return data.content;
              return [];
            } catch {
              return [];
            }
          })
        );
        // 3. Unir todas las órdenes en un solo array
        const todasLasOrdenes = ordenesPorUsuario.flat().filter(Boolean);
        setTotalOrdenes(todasLasOrdenes.length);
        // Si no hay órdenes, evitar errores en los gráficos
        if (!Array.isArray(todasLasOrdenes) || todasLasOrdenes.length === 0) {
          setVentasPorDia([]);
          setVentasPorMes([]);
          setPronosticoVentas([]);
          setLoading(false);
          return;
        }
        // 4. Agrupar ventas por día y por mes usando fechaCreacion
        const ventasDia = agruparVentasPorDia(todasLasOrdenes);
        const ventasMes = agruparVentasPorMes(todasLasOrdenes);
        setVentasPorDia(ventasDia);
        setVentasPorMes(ventasMes);
        setPronosticoVentas(calcularPronosticoVentas(ventasMes, 3));
        // Calcular top productos vendidos por cantidad
        const topVendidos = contarProductosVendidos(todasLasOrdenes).slice(
          0,
          10
        );
        setTopProductosVendidos(topVendidos);
      } catch (e) {
        setError(e.message || "Error al cargar ventas.");
        setVentasPorDia([]);
        setVentasPorMes([]);
        setPronosticoVentas([]);
        setTotalOrdenes(0);
        setTopProductosVendidos([]);
      } finally {
        setLoading(false);
      }
    }
    async function fetchProductos() {
      try {
        const res = await dispatch(fetchProductos());
        const data = res.data;
        const productos = Array.isArray(data.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];
        // Top productos más vendidos
        const productosOrdenados = [...productos]
          .sort((a, b) => (b.ventas_totales || 0) - (a.ventas_totales || 0))
          .slice(0, 10)
          .map((p) => ({
            nombreProducto: p.nombre,
            unidadesVendidas: p.ventas_totales || 0,
          }));
        setTopProductosVendidos(productosOrdenados);

        // Productos con stock bajo (menos de 10)
        setProductosStockBajo(productosConStockBajo(productos));
      } catch (e) {
        setError(e.message || "Error al cargar productos.");
        setTopProductosVendidos([]);
        setProductosStockBajo([]);
      }
    }
    fetchVentas();
    fetchProductos();
  }, [dispatch, token]);

  return (
    <div className="max-w-6xl mx-auto">
      <AdminNavbar />
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      {isAdminRoot && !error && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cajita de ventas totales */}
          <div className="col-span-1 md:col-span-2 flex gap-6 mb-4">
            <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center border border-blue-100 min-h-[110px]">
              <div className="text-lg font-semibold text-gray-700 mb-1">
                Órdenes totales
              </div>
              {loading || totalOrdenes === null ? (
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mt-2" />
              ) : (
                <div className="text-4xl font-extrabold text-primary">
                  {totalOrdenes}
                </div>
              )}
            </div>
          </div>

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

          {/* Top Productos Vendidos por cantidad */}
          <div className="bg-white rounded p-4 shadow col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-2">
              Top Productos Más Vendidos (por unidades)
            </h3>
            <ResponsiveContainer
              width="100%"
              height={40 + 40 * topProductosVendidos.length}
            >
              <BarChart
                layout="vertical"
                data={topProductosVendidos}
                margin={{ left: 40, right: 30, top: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="nombreProducto"
                  width={180}
                  interval={0}
                  tick={{ fontSize: 14 }}
                />
                <Tooltip formatter={(value) => `${value} u`} />
                <Bar dataKey="unidadesVendidas" fill={colores[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Productos con Stock Bajo */}
          <div className="bg-white rounded p-4 shadow col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-2">
              Productos con Stock Bajo (&lt; 10)
            </h3>
            <ResponsiveContainer
              width="100%"
              height={Math.max(300, 40 + 40 * productosStockBajo.length)}
            >
              <BarChart layout="vertical" data={productosStockBajo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="nombreProducto"
                  width={180}
                  interval={0}
                  tick={{ fontSize: 14 }}
                />
                <Tooltip formatter={(value) => `${value} unidades`} />
                <Bar dataKey="stock" fill={colores[4]} name="Stock Actual" />
                <Bar
                  dataKey="stock_minimo"
                  fill={colores[5]}
                  name="Stock Mínimo"
                />
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
