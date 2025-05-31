import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import CategoryAdminListCard from "../components/CategoryAdminListCard";

export default function AdminPanelCategoriesPage() {
    const { usuario, token } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategorias() {
      try {
            const res = await fetch("http://localhost:4040/categorias", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
          const data = await res.json();
          setCategorias(data.content || data);
        } else {
          setError("No se pudieron cargar las categorías.");
        }
      } catch {
        setError("Error de red al cargar categorías.");
      }
    }
    fetchCategorias();
  }, []);

  const handleEdit = (categoria) => {
    navigate(`/editar-categoria/${categoria.id}`);
  };

  const handleDelete = async (categoria) => {
    const res = await fetch(`http://localhost:4040/categorias/${categoria.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setSuccess("Categoría eliminada correctamente.");
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
    } else {
      setError("No se pudo eliminar la categoría.");
    }
  };

  const handleCreate = () => {
    navigate("/crear-categoria");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Panel de categorías</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          onClick={handleCreate}
        >
          Crear categoría
        </button>
      </div>
      <h3>Categorías disponibles:</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categorias.map((cat) => (
          <CategoryAdminListCard
            key={cat.id}
            categoria={cat}
            onEdit={() => handleEdit(cat)}
            onDelete={() => handleDelete(cat)}
          />
        ))}
      </div>
    </div>
  );
}