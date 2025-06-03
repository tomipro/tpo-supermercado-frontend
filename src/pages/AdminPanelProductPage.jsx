import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import ProductAdminListCard from "../components/ProductAdminListCard";

export default function AdminPanelProductPage() {
  const { usuario, token } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/1046/1046857.png"


  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch("http://localhost:4040/producto", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.content)) {
            setProductos(data.content);
          } else {
            setProductos([]);
          }
        } else {
          setError("No se pudieron cargar los productos.");
        }
      } catch (e) {
        setError("Error de red al cargar productos.");
      }
    }
    fetchProductos();
  }, [token]);

  const handleEdit = (producto) => {
    navigate(`/editar-producto/${producto.id}`);
  };

  const handleDelete = async (producto) => {
    const res = await fetch(`http://localhost:4040/producto/${producto.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setSuccess("Producto eliminado correctamente.");
      setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    } else {
      setError("No se pudo eliminar el producto.");
    }
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
    </div>
  );
}