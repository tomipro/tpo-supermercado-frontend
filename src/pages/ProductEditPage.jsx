import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useSelector } from "react-redux";

const PRODUCTO_VACIO = {
  nombre: "",
  descripcion: "",
  imagenes: [],
  precio: 0,
  marca: "",
  categoria_id: 0,
  stock: 0,
  descuento: 0,
  stock_minimo: 0,
  unidad_medida: "",
  estado: "activo",
  ventas_totales: 0,
};

export default function ProductEditPage({ modo = "editar" }) {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [producto, setProducto] = useState(modo === "crear" ? PRODUCTO_VACIO : null);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState("");

  // Cargar categorías al montar
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("http://localhost:4040/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCategorias(data.content || data);
        }
      } catch {}
    }
    fetchCategorias();
  }, [token]);

  // Solo buscar producto si es modo editar
  useEffect(() => {
    if (modo === "editar") {
      async function fetchProducto() {
        try {
          const res = await fetch(`http://localhost:4040/producto/id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            // Normaliza imágenes: siempre array de objetos { url }
            const imagenesNormalizadas = Array.isArray(data.imagenes)
              ? data.imagenes.map(img =>
                  typeof img === "string"
                    ? { url: img }
                    : img && img.url
                    ? { url: img.url }
                    : img && img.imagen
                    ? { url: img.imagen }
                    : null
                ).filter(Boolean)
              : [];
            let categoria_id = "";
            if (data.categoria && categorias.length > 0) {
              // Busca el id de la categoría por nombre
              const cat = categorias.find(c => c.nombre === data.categoria);
              categoria_id = cat ? cat.id : "";
            }
            setProducto({
              ...data,
              imagenes: imagenesNormalizadas,
              categoria_id,
              // Normalización de campos para evitar problemas de nombres
              stock_minimo: data.stock_minimo ?? data.stockMinimo ?? 0,
              unidad_medida: data.unidad_medida ?? data.unidadMedida ?? "",
              ventas_totales: data.ventas_totales ?? data.ventasTotales ?? 0,
              descuento: data.descuento ?? data.descuento ?? 0,
              precio: data.precio ?? data.precio ?? 0,
              stock: data.stock ?? data.stock ?? 0,
              marca: data.marca ?? data.marca ?? "",
              descripcion: data.descripcion ?? data.descripcion ?? "",
              estado: data.estado ?? data.estado ?? "activo",
              nombre: data.nombre ?? data.nombre ?? "",
            });
          } else {
            setError("No se pudo cargar el producto.");
          }
        } catch {
          setError("Error de red.");
        }
      }
      fetchProducto();
    }
  }, [id, token, modo]);

  useEffect(() => {
    if (
      producto &&
      !producto.categoria_id &&
      producto.categoria &&
      categorias.length > 0
    ) {
      const cat = categorias.find((c) => c.nombre === producto.categoria);
      if (cat) {
        setProducto((prev) => ({
          ...prev,
          categoria_id: cat.id,
        }));
      }
    }
  }, [producto, categorias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: name === "categoria_id" ? Number(value) : value,
    }));
  };

  const handleEliminarImagen = (idx) => {
    setProducto((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== idx),
    }));
  };

  const handleAgregarImagen = () => {
    if (nuevaImagen.trim() === "") return;
    setProducto((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, { url: nuevaImagen }],
    }));
    setNuevaImagen("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const url =
        modo === "crear"
          ? "http://localhost:4040/producto"
          : `http://localhost:4040/producto/${id}`;
      const method = modo === "crear" ? "POST" : "PUT";
      const body = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagenes: producto.imagenes ? producto.imagenes.map((img) => img.url) : null,
        precio: producto.precio === "" || producto.precio == null ? 0 : producto.precio,
        marca: producto.marca === "" || producto.marca == null ? "Sin marca" : producto.marca,
        categoria_id: producto.categoria?.id || producto.categoria_id,
        stock: producto.stock === "" || producto.stock == null ? 0 : producto.stock,
        descuento: producto.descuento === "" || producto.descuento == null ? 0 : producto.descuento,
        stockMinimo: producto.stock_minimo === "" || producto.stock_minimo == null ? 0 : producto.stock_minimo,
        unidadMedida: producto.unidad_medida,
        estado: producto.estado,
        ventasTotales: producto.ventas_totales === "" || producto.ventas_totales == null ? 0 : producto.ventas_totales,
      };
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess(modo === "crear" ? "Producto creado correctamente." : "Producto actualizado correctamente.");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setError(modo === "crear" ? "No se pudo crear el producto." : "No se pudo actualizar el producto.");
      }
    } catch {
      setError("Error de red.");
    }
  };

  if (!producto) return (<div
  className="mx-auto w-[600px] bg-gray-950 rounded-xl overflow-hidden drop-shadow-2xl"
>
  <div
    className="bg-[#202020] flex items-center p-[20px] text-white relative rounded-t-xl"
  >
    <div className="flex absolute left-3 space-x-2">
      <span
        className="h-3.5 w-3.5 bg-[#ff605c] rounded-full transition-all hover:scale-125 hover:bg-[#ff3b36]"
      ></span>
      <span
        className="h-3.5 w-3.5 bg-[#ffbd44] rounded-full transition-all hover:scale-125 hover:bg-[#ffaa33]"
      ></span>
      <span
        className="h-3.5 w-3.5 bg-[#2563eb] rounded-full transition-all hover:scale-125 hover:bg-[#1d4ed8]"
      ></span>
    </div>

    <div
      className="flex-1 text-center text-white font-semibold text-lg relative animate-pulse"
    >
      <div className="text-xl">Cargando...</div>
    </div>

    <div className="absolute w-full bottom-0 left-0 bg-[#333333] h-1 rounded-t-xl">
      <div className="w-[30%] bg-[#2563eb] h-full animate-progressBar"></div>
    </div>
  </div>

  <div className="flex bg-[#121212] p-8 justify-center items-center h-[450px]">
    <div className="text-center space-y-6">
      <div
        className="w-24 h-24 border-4 border-t-[#2563eb] border-gray-700 rounded-full animate-spin mx-auto"
      ></div>
      <div
        className="text-[#2563eb] font-semibold text-4xl opacity-90 animate-fadeIn"
      >
        Ya casi esta listo...
      </div>
      <div class="text-[#9e9e9e] text-sm opacity-80 animate-fadeIn">
        <p>Estamos preparando todo para ti...</p>
        <p>Por favor, espera un momento.</p>
      </div>
    </div>
  </div>

  <div class="bg-[#202020] p-4 text-center text-gray-400 text-xs font-mono">
    <p>Agradecemos tu paciencia. ¡Ya casi está!</p>
  </div>
</div>
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {modo === "crear" ? "Crear producto" : "Editar producto"}
      </h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {modo === "editar" && (
          <div>
            <label className="font-semibold">ID</label>
            <input className="input" value={producto.id} disabled readOnly />
          </div>
        )}
        <div>
          <label className="font-semibold">Nombre</label>
          <input
            className="input"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
            disabled={modo === "editar"}
            readOnly={modo === "editar"}
          />
        </div>
        <div>
          <label className="font-semibold">Marca</label>
          <input
            className="input"
            name="marca"
            value={producto.marca}
            onChange={handleChange}
            required
            disabled={modo === "editar"}
            readOnly={modo === "editar"}
          />
        </div>
        <div>
          <label className="font-semibold">Categoría</label>
          <select
            className="input"
            name="categoria_id"
            value={producto.categoria_id || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Descripción</label>
          <textarea
            className="input"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="font-semibold">Precio</label>
          <input
            className="input"
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="font-semibold">Stock</label>
          <input
            className="input"
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="font-semibold">Unidad de medida</label>
          <input
            className="input"
            name="unidad_medida"
            value={producto.unidad_medida}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Descuento (%)</label>
          <input
            className="input"
            type="number"
            name="descuento"
            value={producto.descuento}
            onChange={handleChange}
            step="0.01"
          />
        </div>
        <div>
          <label className="font-semibold">Ventas totales</label>
          <input
            className="input"
            type="number"
            name="ventas_totales"
            value={producto.ventas_totales}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Stock mínimo</label>
          <input
            className="input"
            type="number"
            name="stock_minimo"
            value={producto.stock_minimo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Estado</label>
          <select
            className="input"
            name="estado"
            value={producto.estado}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        {/* Sección de imágenes */}
        <div>
          <label className="font-semibold">Imágenes</label>
          <div className="space-y-2">
            {producto.imagenes && producto.imagenes.length > 0 ? (
              producto.imagenes.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center mb-4">
                  <img
                    src={typeof img === "string" ? img : img?.url || img?.imagen || ""}
                    alt={`Imagen ${idx + 1}`}
                    className="w-40 h-40 object-cover rounded border mb-2"
                  />
                  <button
                    type="button"
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEliminarImagen(idx)}
                  >
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No hay imágenes</div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="URL de la nueva imagen"
              value={nuevaImagen}
              onChange={(e) => setNuevaImagen(e.target.value)}
            />
            <button
              type="button"
              className="bg-primary text-white px-3 py-1 rounded"
              onClick={handleAgregarImagen}
            >
              Agregar
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded font-semibold"
          >
            {modo === "crear" ? "Crear producto" : "Guardar cambios"}
          </button>
          <button
            type="button"
            className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
            onClick={() => navigate("/admin")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}