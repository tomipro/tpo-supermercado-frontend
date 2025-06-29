import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategorias } from "../redux/categoriesSlice";

const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/1046/1046857.png";

function SkeletonCategoryCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-gray-100 rounded mb-1" />
    </div>
  );
}

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const categoriasState = useSelector((state) => state.categorias);
  // Siempre forzamos a array plano
  const categories = Array.isArray(categoriasState?.categorias)
    ? categoriasState.categorias
    : [];
  const loading = categoriasState?.loading || false;

  useEffect(() => {
    dispatch(fetchCategorias());
    // eslint-disable-next-line
  }, []);

  // Debug: ver el array real
  // console.log("categories", categories);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 text-primary">Categorías</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCategoryCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 text-primary">Categorías</h1>
        <div className="text-gray-500">No hay categorías disponibles.</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-6">
      <h1 className="text-3xl font-bold mb-8 text-primary">Categorías</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/buscar?categoriaId=${cat.id}`}
            className="flex flex-col items-center bg-white rounded-xl shadow hover:shadow-xl transition group p-4 border border-gray-100 hover:border-primary"
          >
            <div
              className="w-20 h-20 flex items-center justify-center rounded-full mb-2 border-2 border-accent group-hover:scale-105 transition bg-gray-100 text-primary"
              style={{
                fontSize: "3rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                userSelect: "none",
              }}
            >
              {cat.nombre?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="text-lg font-medium text-dark group-hover:text-primary transition text-center">
              {cat.nombre}
            </span>
            {cat.subcategorias && cat.subcategorias.length > 0 && (
              <div className="mt-2 text-xs text-muted text-center">
                Subcategorías:{" "}
                {cat.subcategorias.map((sub) => sub.nombre).join(", ")}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
