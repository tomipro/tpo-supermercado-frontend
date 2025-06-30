import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDirecciones,
  saveDireccion,
  deleteDireccion,
  clearDireccionesMsg,
} from "../redux/direccionesSlice";

export default function MisDireccionesPage() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const direccionesState = useSelector((state) => state.direcciones);
  const direcciones = direccionesState?.direcciones || [];
  const loading = direccionesState?.loading;
  const error = direccionesState?.error;
  const success = direccionesState?.success;

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
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (token) dispatch(fetchDirecciones(token));
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearDireccionesMsg()), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.calle ||
      !form.numero ||
      !form.ciudad ||
      !form.provincia ||
      !form.codigoPostal ||
      !form.tipoVivienda
    ) {
      return;
    }
    await dispatch(
      saveDireccion({
        token,
        direccion: {
          ...form,
          pisoDepto: form.tipoVivienda === "departamento" ? form.pisoDepto : "",
        },
        editId,
      })
    );
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta dirección?")) return;
    await dispatch(deleteDireccion({ token, id }));
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {editId ? "Guardar cambios" : "Guardar dirección"}
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
      {(success || error) && (
        <div className={`mt-4 text-center ${success ? "text-green-600" : "text-red-600"}`}>
          {success || error}
        </div>
      )}
    </div>
  );
}
