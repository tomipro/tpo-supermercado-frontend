import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import ProductAdminListCard from "../components/ProductAdminListCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducto, deleteProducto } from "../redux/productosSlice";
import axios from "axios";
import { loginThunk } from "../redux/authSlice";

export default function AdminPanelProductPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();
  const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/1046/1046857.png"

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await dispatch(fetchProducto({ token, page, pageSize }));
        if (res.status === 200) {
          const data = res.data;
          if (Array.isArray(data.content)) {
            setProductos(data.content);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || data.content.length || 0);
          } else {
            setProductos([]);
            setTotalPages(1);
            setTotalElements(0);
          }
        } else {
          setError("No se pudieron cargar los productos.");
        }
      } catch (e) {
        setError("Error de red al cargar productos.");
      }
    }
    fetchProductos();
  }, [dispatch, token, page, pageSize]);

  const handleEdit = (producto) => {
    navigate(`/editar-producto/${producto.id}`);
  };

  const handleDelete = async (producto) => {
    dispatch(deleteProducto({ id: producto.id, token }));
  };

  const handleCreate = () => {
    navigate("/crear-producto");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Panel de productos</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          onClick={handleCreate}
        >
          Crear producto
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <h3>Productos disponibles:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productos.map((prod) => (
          <ProductAdminListCard
            key={prod.id}
            id={prod.id}
            name={prod.nombre}
            brand={prod.marca}
            price={prod.precio}
            imagenes={
              prod.imagenes && prod.imagenes.length > 0
                ? prod.imagenes.map((img) =>
                    typeof img === "string" && img.startsWith("http")
                      ? img
                      : FALLBACK_IMG
                  )
                : [FALLBACK_IMG]
            }
            descuento={prod.descuento}
            onEdit={() => handleEdit(prod)}
            onDelete={() => handleDelete(prod)}
          />
        ))}
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded bg-accent text-primary font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            title="Página anterior"
          >
            ←
          </button>
          <span className="text-sm text-gray-600">
            Página {page + 1} de {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-accent text-primary font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            title="Página siguiente"
          >
            →
          </button>
          <span className="ml-4 text-xs text-gray-500">
            Mostrando {productos.length} de {totalElements} productos
          </span>
          <label className="ml-4 text-sm text-gray-700">
            Mostrar:
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="ml-2 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-primary text-sm"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}