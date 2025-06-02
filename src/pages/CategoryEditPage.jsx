import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import ProductAdminListCard from "../components/ProductAdminListCard";

// Plantilla para nueva categoría
const CATEGORIA_VACIA = {
  nombre: "",
  parentCategoria: null,
  subcategorias: [],
  productos: [],
};

export default function CategoryEditPage({ modo = "editar" }) {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Estado principal
  const [categoria, setCategoria] = useState(
    modo === "crear" ? CATEGORIA_VACIA : null
  );
  const [nombre, setNombre] = useState("");
  const [parentId, setParentId] = useState("");
  const [allCategorias, setAllCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mueve estas funciones fuera del useEffect para poder usarlas en los handlers
  async function fetchCategoria() {
    try {
      const res = await fetch(`http://localhost:4040/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategoria(data);
        setNombre(data.nombre);
        setParentId(data.parentCategoria?.id || "");
        setSubcategorias(data.subcategorias || []);
      }
    } catch {
      setError("No se pudo cargar la categoría.");
    }
  }
  async function fetchAllCategorias() {
    try {
      const res = await fetch("http://localhost:4040/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllCategorias(data.content || data);
      }
    } catch {}
  }

  // Carga inicial
  useEffect(() => {
    if (modo === "editar") fetchCategoria();
    fetchAllCategorias();
  }, [id, token, modo]);

  // Handlers básicos
  const handleParentChange = (e) => setParentId(e.target.value);
  const handleNombreChange = (e) => setNombre(e.target.value);

  // Agregar subcategoría
  const handleAddSubcategoria = async () => {
    if (!selectedSubId) return;
    const catToAdd = allCategorias.find((c) => c.id === selectedSubId);
    if (!catToAdd) return;

    if (modo === "crear") {
      setSubcategorias([...subcategorias, catToAdd]);
      setAllCategorias(allCategorias.filter((c) => c.id !== catToAdd.id));
      setSelectedSubId("");
    } else {
      const res = await fetch(
        `http://localhost:4040/categorias/${catToAdd.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: catToAdd.nombre,
            parentId: categoria.id,
          }),
        }
      );
      if (res.ok) {
        setSelectedSubId("");
        await fetchCategoria();
        await fetchAllCategorias();
      }
    }
  };

  // Quitar subcategoría
  const handleRemoveSubcategoria = async (sub) => {
    if (modo === "crear") {
      setSubcategorias(subcategorias.filter((s) => s.id !== sub.id));
      setAllCategorias([...allCategorias, sub]);
    } else {
      const res = await fetch(
        `http://localhost:4040/categorias/${sub.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: sub.nombre,
            parentId: null,
          }),
        }
      );
      if (res.ok) {
        await fetchCategoria();
        await fetchAllCategorias();
      }
    }
  };

  // Guardar cambios o crear
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      let res;
      if (modo === "crear") {
        res = await fetch("http://localhost:4040/categorias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre, parentId: parentId || null }),
        });
        if (res.ok) {
          const createdCat = await res.json();
          await Promise.all(
            subcategorias.map((sub) =>
              fetch(
                `http://localhost:4040/categorias/${sub.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    nombre: sub.nombre,
                    parentId: createdCat.id,
                  }),
                }
              )
            )
          );
        }
      } else {
        res = await fetch(
          `http://localhost:4040/categorias/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nombre, parentId: parentId || null }),
          }
        );
      }
      if (res.ok) {
        setSuccess(
          modo === "crear"
            ? "Categoría creada correctamente."
            : "Categoría actualizada correctamente."
        );
        setTimeout(() => navigate("/admin/categorias"), 1200);
      }
    } catch {
      setError("Error al guardar la categoría.");
    }
  };

  // Cargando en edición
  if (modo === "editar" && !categoria) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {modo === "crear" ? "Crear Categoría" : "Editar Categoría"}
      </h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        {modo === "editar" && (
          <div>
            <label className="font-semibold">ID</label>
            <input
              className="input" value={categoria.id} disabled readOnly
            />
          </div>
        )}
        <div>
          <label className="font-semibold">Nombre</label>
          <input
            className="input"
            value={nombre}
            onChange={handleNombreChange}
            required
          />
        </div>
        <div>
          <label className="font-semibold">Categoría padre</label>
          <select
            className="input"
            value={parentId}
            onChange={handleParentChange}
          >
            <option value="">Sin categoría padre</option>
            {allCategorias
              .filter(
                (c) => !c.parentCategoria && c.id !== categoria?.id
              )
              .map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
          </select>
        </div>
        <div className="mt-6">
          <label className="font-semibold">Subcategorías</label>
          {(modo === "editar"
            ? categoria?.subcategorias || []
            : subcategorias
          ).length > 0 ? (
            <ul className="list-disc ml-6">
              {(modo === "editar"
                ? categoria?.subcategorias || []
                : subcategorias
              ).map((sub) => (
                <li
                  key={sub.id}
                  className="flex justify-between items-center"
                >
                  <span>{sub.nombre}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategoria(sub)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 mb-4">No tiene subcategorías</div>
          )}
        </div>

        {/* Botones Guardar/Crear y Cancelar */}
        <div className="flex">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded font-semibold"
          >
            {modo === "crear" ? "Crear Categoría" : "Guardar cambios"}
          </button>
          <button
            type="button"
            className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded font-semibold ml-2 transition-colors"
            onClick={() => navigate("/admin/categorias")}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Sólo en edición: muestro productos de la categoría */}
      {modo === "editar" && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">
            Productos de esta categoría
          </h3>
          {categoria.productos && categoria.productos.length > 0 ? (
            categoria.productos.map((prod) => (
              <ProductAdminListCard
                key={prod.id}
                producto={prod}
              />
            ))
          ) : (
            <div className="text-gray-500">
              No hay productos en esta categoría.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

