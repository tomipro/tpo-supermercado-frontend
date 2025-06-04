import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../context/CartContext";

// todo esto se  va cuando integramos backend.. osea hariamos un fetch de estas cosas

const CATEGORIAS = [
  {
    value: "verduleria",
    label: "Verdulería",
    sub: ["Frutas", "Verduras", "Tubérculos"],
  },
  {
    value: "carnes",
    label: "Carnes",
    sub: ["Vacuna", "Pollo", "Cerdo", "Pescado"],
  },
  { value: "lacteos", label: "Lácteos", sub: ["Leche", "Quesos", "Yogur"] },
  {
    value: "panaderia",
    label: "Panadería",
    sub: ["Pan", "Facturas", "Tortillas"],
  },
  {
    value: "snacks",
    label: "Snacks",
    sub: ["Galletitas", "Chocolates", "Papas"],
  },
  { value: "bebidas", label: "Bebidas", sub: ["Sin alcohol", "Con alcohol"] },
  {
    value: "limpieza",
    label: "Limpieza",
    sub: ["Ropa", "Superficies", "Cocina"],
  },
  {
    value: "cuidado-personal",
    label: "Cuidado personal",
    sub: ["Cabello", "Cuerpo", "Higiene"],
  },
];

const MARCAS = [
  "La Serenísima",
  "Bimbo",
  "Coca-Cola",
  "Pepsi",
  "Sancor",
  "Molinos",
  "Arcor",
  "Ala",
  "Head & Shoulders",
];

const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre-asc", label: "Nombre: A-Z" },
  { value: "nombre-desc", label: "Nombre: Z-A" },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
      <div className="w-24 h-24 bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-gray-100 rounded mb-1" />
      <div className="h-5 w-1/3 bg-gray-200 rounded mb-2" />
    </div>
  );
}

function ProductQuickView({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState(0);

  useEffect(() => {
    setQty(1);
    setAdded(false);
    setUnits(0);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, product]);

  if (!product) return null;

  const stock = product.stock ?? 0;
  const description = product.descripcion || product.description || "";
  const price = product.precio ?? product.price;
  const name = product.nombre ?? product.name;
  const brand = product.marca ?? product.brand;
  const img =
    (product.imagenes &&
      Array.isArray(product.imagenes) &&
      product.imagenes[0]?.imagen) ||
    (product.imagenes &&
      Array.isArray(product.imagenes) &&
      typeof product.imagenes[0] === "string" &&
      product.imagenes[0]) ||
    product.imagenUrl ||
    product.img;

  function handleBgClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const handleAdd = async () => {
    if (!onAddToCart || !product.id) return;
    setLoading(true);
    await onAddToCart(product.id, qty);
    setAdded(true);
    setUnits(units + qty);
    setLoading(false);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleBgClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 relative flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 md:p-8">
          {img ? (
            <img
              src={img}
              alt={name}
              className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
              draggable={false}
            />
          ) : (
            <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-100 rounded-xl shadow-lg flex items-center justify-center text-5xl">
              🛒
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col p-6 md:p-8">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
            onClick={onClose}
            aria-label="Cerrar"
            tabIndex={0}
          >
            ×
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-xl text-dark">{name}</span>
            {product.descuento > 0 && (
              <span className="bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {product.descuento}% OFF
              </span>
            )}
          </div>
          <div className="text-sm text-muted mb-1">{brand}</div>
          <div className="text-primary font-bold text-2xl mb-1">${price}</div>
          <div className="text-xs text-gray-400 mb-3">
            Precio sin impuestos nacionales: $
            {price ? Math.round(price / 1.21) : 0}
          </div>
          <div className="text-gray-600 text-sm mb-4">{description}</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-secondary">En stock</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <label htmlFor="qty" className="text-sm text-gray-700">
              Cantidad:
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              max={stock}
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(stock, Number(e.target.value))))
              }
              className="w-16 px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            className={`bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow transition text-base w-full flex items-center justify-center gap-2 relative
							${added ? "bg-green-600" : "hover:bg-secondary"}
							${loading ? "opacity-70 cursor-not-allowed" : ""}
						`}
            onClick={handleAdd}
            disabled={loading}
          >
            {added ? (
              <span className="inline-flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                ¡Agregado!
              </span>
            ) : loading ? (
              "Agregando..."
            ) : (
              <>
                <span>Agregar al carrito</span>
                <span className="font-bold">×{qty}</span>
              </>
            )}
            {units > 0 && (
              <span className="absolute right-3 bottom-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold pointer-events-none">
                x{units}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
function useQueryParam(name) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name);
}

export default function BuscarPage() {
  const categoriaIdParam = useQueryParam("categoriaId");
  const { token } = useAuth();
  const { refreshCarrito } = useCart();
  const searchParam = useQueryParam("search");
  const [query, setQuery] = useState(searchParam);
  const [marcas, setMarcas] = useState([]);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [promo, setPromo] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [sortBy, setSortBy] = useState("relevancia");
  const [quickView, setQuickView] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoriasApi, setCategoriasApi] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  // Si hay un ID de categoría en la URL, lo agregamos a los filtros
  useEffect(() => {
    if (categoriaIdParam && categoriasApi.length > 0) {
      // Solo agregá el ID de la categoría principal
      setCategorias([String(categoriaIdParam)]);
      setPage(0); // opcional: resetea la página al cambiar filtro
    }
    // Solo corre cuando cambian estos valores
  }, [categoriaIdParam, categoriasApi]);

  // Fetch categorías desde el backend
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("http://localhost:4040/categorias");
        const data = await res.json();
        setCategoriasApi(Array.isArray(data.content) ? data.content : []);
      } catch (err) {
        setCategoriasApi([]);
      }
    }
    fetchCategorias();
  }, []);

  // Fetch productos del backend paginado
  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      setError("");
      try {
        let url = "http://localhost:4040/producto";
        const params = [];
        if (query) params.push(`nombre=${encodeURIComponent(query)}`);
        if (marcas.length > 0) params.push(`marca=${marcas.join(",")}`);
        if (categorias.length > 0)
          params.push(`categoriaId=${categorias[0]}`); // Solo el primer ID
        if (subcategorias.length > 0)
          params.push(`subcategoriaId=${subcategorias.join(",")}`);
        if (promo) params.push(`oferta=true`);
        if (precioMin) params.push(`precioMin=${precioMin}`);
        if (precioMax) params.push(`precioMax=${precioMax}`);
        params.push(`page=${page}`);
        params.push(`size=${pageSize}`);
        if (params.length > 0) url += "?" + params.join("&");

        // Ejemplo de URL generada:
        // http://localhost:4040/producto?categoriaId=1&page=0&size=12

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProductos(Array.isArray(data.content) ? data.content : []);
        setTotalPages(
          data.totalPages ||
            Math.ceil(
              (data.totalElements || data.content?.length || 0) / pageSize
            )
        );
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
        setProductos([]);
        setTotalPages(1);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
    // eslint-disable-next-line
  }, [
    query,
    marcas,
    categorias,
    subcategorias,
    promo,
    precioMin,
    precioMax,
    page,
    pageSize,
    categoriaIdParam,
  ]);

  useEffect(() => {
    setQuery(searchParam);
  }, [searchParam]);

  // Subcategorías disponibles según categorías seleccionadas (de la API)
  const subcategoriasDisponibles = categoriasApi
    .filter((cat) => categorias.includes(String(cat.id)))
    .flatMap((cat) => cat.subcategorias || [])
    .map((sub) => ({ id: String(sub.id), nombre: sub.nombre }))
    .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i);

  const productosFiltrados = [...productos].sort((a, b) => {
    if (sortBy === "precio-asc") return a.precio - b.precio;
    if (sortBy === "precio-desc") return b.precio - a.precio;
    if (sortBy === "nombre-asc")
      return (a.nombre || "").localeCompare(b.nombre || "");
    if (sortBy === "nombre-desc")
      return (b.nombre || "").localeCompare(a.nombre || "");
    return 0;
  });

  function handleMarcaChange(marca) {
    setMarcas((marcas) =>
      marcas.includes(marca)
        ? marcas.filter((m) => m !== marca)
        : [...marcas, marca]
    );
  }

  function handleCategoriaChange(catId) {
    setCategorias((categorias) =>
      categorias.includes(catId)
        ? categorias.filter((c) => c !== catId)
        : [...categorias, catId]
    );
    setSubcategorias((subs) =>
      subs.filter((sub) =>
        subcategoriasDisponibles.map((s) => s.id).includes(sub)
      )
    );
  }

  function handleSubcategoriaChange(subId) {
    setSubcategorias((subcategorias) =>
      subcategorias.includes(subId)
        ? subcategorias.filter((s) => s !== subId)
        : [...subcategorias, subId]
    );
  }

  async function handleAddToCart(id, cantidad) {
    try {
      await fetch(`http://localhost:4040/carritos/${id}?cantidad=${cantidad}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      refreshCarrito();
    } catch {}
  }

  // Para animación visual en ProductCard
  const [addedId, setAddedId] = useState(null);
  const [unitsMap, setUnitsMap] = useState({});

  const handleAddToCartWithAnim = async (id, cantidad) => {
    await handleAddToCart(id, cantidad);
    setUnitsMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + cantidad }));
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  // Paginación
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Buscar productos</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar de filtros */}
        <aside className="w-full md:w-72 flex-shrink-0 mb-4 md:mb-0">
          <form className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 sticky top-28">
            <div>
              <label className="block text-sm font-medium mb-1">Buscar</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre, marca, etc."
                className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marca</label>
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                {MARCAS.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={marcas.includes(m)}
                      onChange={() => handleMarcaChange(m)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Categoría
              </label>
              <div>
                <label className="block text-sm font-medium mb-1"></label>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                  {categoriasApi.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={categorias.includes(String(c.id))}
                        onChange={() => handleCategoriaChange(String(c.id))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      {c.nombre}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Subcategoría
              </label>
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                {subcategoriasDisponibles.length === 0 && (
                  <span className="text-xs text-gray-400">
                    Seleccioná una categoría
                  </span>
                )}
                {subcategoriasDisponibles.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={subcategorias.includes(String(sub.id))}
                      onChange={() => handleSubcategoriaChange(String(sub.id))}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    {sub.nombre}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Precio mínimo
                </label>
                <input
                  type="number"
                  min={0}
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Precio máximo
                </label>
                <input
                  type="number"
                  min={0}
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="promo"
                type="checkbox"
                checked={promo}
                onChange={(e) => setPromo(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="promo" className="text-sm font-medium">
                Solo en promoción
              </label>
            </div>
          </form>
        </aside>
        {/* Resultados */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-xl font-semibold text-dark">Resultados</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-gray-700">
                Ordenar por:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-primary text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Mostrar por página */}
              <label htmlFor="pageSize" className="ml-4 text-sm text-gray-700">
                Mostrar:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-primary text-sm"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "2rem 2.5rem",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-gray-500">
              No se encontraron productos con esos filtros.
            </div>
          ) : (
            <>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "2rem 2.5rem",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                {productosFiltrados.map((p, i) => (
                  <ProductCard
                    key={p.id || i}
                    id={p.id}
                    name={p.nombre}
                    brand={p.marca}
                    img={
                      (Array.isArray(p.imagenes) && p.imagenes[0]?.imagen) ||
                      (Array.isArray(p.imagenes) &&
                        typeof p.imagenes[0] === "string" &&
                        p.imagenes[0]) ||
                      undefined
                    }
                    price={p.precio}
                    weight={p.unidad_medida}
                    offer={p.descuento > 0 ? `${p.descuento}% OFF` : undefined}
                    bestSeller={p.bestSeller}
                    onQuickView={setQuickView}
                    onAddToCart={handleAddToCartWithAnim}
                    added={addedId === p.id}
                    units={unitsMap[p.id] || 0}
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
                  >
                    ←
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {page + 1} de {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded bg-accent text-primary font-semibold disabled:opacity-50"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                  >
                    →
                  </button>
                  <span className="ml-4 text-xs text-gray-500">
                    Mostrando {productosFiltrados.length} de{" "}
                    {totalElements || productosFiltrados.length} productos
                  </span>
                </div>
              )}
            </>
          )}
          <ProductQuickView
            product={quickView}
            onClose={() => setQuickView(null)}
            onAddToCart={handleAddToCartWithAnim}
          />
        </main>
      </div>
    </div>
  );
}
