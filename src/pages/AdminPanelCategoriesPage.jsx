import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryAdminListCard from "../components/CategoryAdminListCard";
import { fetchCategorias, deleteCategoria } from "../redux/categoriesSlice";

export default function AdminPanelCategoriesPage() {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const categoriasState = useSelector((state) => state.categorias);
  const categorias = categoriasState.categorias;
  const error = categoriasState.error;
  const success = categoriasState.success;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategorias());
  }, [dispatch]);

  const handleEdit = (categoria) => {
    navigate(`/editar-categoria/${categoria.id}`);
  };

  const handleDelete = async (categoria) => {
    dispatch(deleteCategoria({ id: categoria.id, token }));
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