import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function MisDireccionesPage() {
  const { token } = useAuth();
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    calle: "",
    numero: "",
    pisoDepto: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    tipoVivienda: "casa",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDirecciones();
    // eslint-disable-next-line
  }, []);

  function fetchDirecciones() {
    setLoading(true);
    setError("");
    fetch("http://localhost:4040/direcciones", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las direcciones.");
        return res.json();
      })
      .then((data) => setDirecciones(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Error al cargar direcciones."))
      .finally(() => setLoading(false));
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFormError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    if (
      !form.calle ||
      !form.numero ||
      !form.ciudad ||
      !form.provincia ||
      !form.codigoPostal ||
      !form.tipoVivienda
    ) {
      setFormError("Completá todos los campos obligatorios.");
      setFormLoading(false);
      return;
    }
    try {
      const url = editId
        ? `http://localhost:4040/direcciones/${editId}`
        : "http://localhost:4040/direcciones";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          pisoDepto: form.tipoVivienda === "departamento" ? form.pisoDepto : "",
        }),
      });
      if (!res.ok) throw new Error(editId ? "No se pudo modificar la dirección." : "No se pudo crear la dirección.");
      setShowForm(false);
      setEditId(null);
      setForm({
        calle: "",
        numero: "",
        pisoDepto: "",
        ciudad: "",
        provincia: "",
        codigoPostal: "",
        tipoVivienda: "casa",
      });
      fetchDirecciones();
    } catch (err) {
      setFormError(err.message || "Error al guardar dirección.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta dirección?")) return;
    try {
      const res = await fetch(`http://localhost:4040/direcciones/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudo eliminar la dirección.");
      fetchDirecciones();
    } catch (err) {
      setError(err.message || "Error al eliminar dirección.");
    }
  };

  const handleEdit = (dir) => {
    setForm({
      calle: dir.calle || "",
      numero: dir.numero || "",
      pisoDepto: dir.pisoDepto || "",
      ciudad: dir.ciudad || "",
      provincia: dir.provincia || "",
      codigoPostal: dir.codigoPostal || "",
      tipoVivienda: dir.tipoVivienda || "casa",
    });
    setEditId(dir.id);
    setShowForm(true);
    setFormError("");
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({
      calle: "",
      numero: "",
      pisoDepto: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      tipoVivienda: "casa",
    });
    setFormError("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-primary">Mis Direcciones</h1>
      <div className="mb-6 flex justify-end">
        <button
          className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          onClick={() => {
            if (showForm && editId) {
              handleCancelForm();
            } else {
              setShowForm((v) => !v);
              setEditId(null);
              setForm({
                calle: "",
                numero: "",
                pisoDepto: "",
                ciudad: "",
                provincia: "",
                codigoPostal: "",
                tipoVivienda: "casa",
              });
              setFormError("");
            }
          }}
        >
          {showForm ? "Cancelar" : "Agregar dirección"}
        </button>
      </div>
      {showForm && (
        <form
          className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8 flex flex-col gap-3"
          onSubmit={handleFormSubmit}
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Calle <span className="text-red-500">*</span>
              </label>
              <input
                name="calle"
                value={form.calle}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="w-28">
              <label className="block text-sm font-medium mb-1">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                name="numero"
                value={form.numero}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <input
                name="ciudad"
                value={form.ciudad}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Provincia <span className="text-red-500">*</span>
              </label>
              <input
                name="provincia"
                value={form.provincia}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">
                Código Postal <span className="text-red-500">*</span>
              </label>
              <input
                name="codigoPostal"
                value={form.codigoPostal}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Tipo de vivienda <span className="text-red-500">*</span>
              </label>
              <select
                name="tipoVivienda"
                value={form.tipoVivienda}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
              </select>
            </div>
            {form.tipoVivienda === "departamento" && (
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Piso/Depto
                </label>
                <input
                  name="pisoDepto"
                  value={form.pisoDepto}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: 3C"
                />
              </div>
            )}
          </div>
          {formError && (
            <div className="text-red-600 text-sm">{formError}</div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
              disabled={formLoading}
            >
              {formLoading
                ? (editId ? "Guardando cambios..." : "Guardando...")
                : (editId ? "Guardar cambios" : "Guardar dirección")}
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <div className="text-gray-500">Cargando direcciones...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : direcciones.length === 0 ? (
        <div className="text-gray-500">No tenés direcciones cargadas.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {direcciones.map((dir) => (
            <div
              key={dir.id}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 hover:border-primary p-6 flex flex-col gap-2 transition"
            >
              <div className="font-semibold text-lg text-dark mb-1">
                {dir.calle} {dir.numero}
                {dir.pisoDepto && (
                  <span className="ml-2 text-sm text-gray-500">
                    Piso/Depto: {dir.pisoDepto}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted">
                {dir.ciudad}, {dir.provincia}
              </div>
              <div className="text-sm text-muted">
                Código Postal: <span className="font-semibold">{dir.codigoPostal}</span>
              </div>
              <div className="text-xs text-gray-400">
                Tipo de vivienda: {dir.tipoVivienda}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded font-semibold"
                  onClick={() => handleEdit(dir)}
                >
                  Modificar
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded font-semibold"
                  onClick={() => handleDelete(dir.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
