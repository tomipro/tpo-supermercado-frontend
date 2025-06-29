import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPerfil,
  updatePerfil,
  clearUsuarioMsg,
} from "../redux/usuarioSlice";
import { useNavigate } from "react-router-dom";
import formatearFecha from "./formatearFecha.jsx";

export default function ProfilePage() {
  const { token, usuario, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usuarioState = useSelector((state) => state.usuario);
  const perfil = usuarioState?.perfil;
  const loading = usuarioState?.loading;
  const error = usuarioState?.error;
  const success = usuarioState?.success;

  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
  });

  useEffect(() => {
    if (token && usuario && usuario.id) {
      dispatch(fetchPerfil({ token, id: usuario.id }));
    }
    // eslint-disable-next-line
  }, [token, usuario]);

  useEffect(() => {
    if (perfil) {
      setFormData({
        email: perfil.email || "",
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "",
      });
    }
  }, [perfil]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearUsuarioMsg()), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  async function handleGuardar(e) {
    e.preventDefault();
    await dispatch(updatePerfil({ token, formData }));
    setEditando(false);
  }

  if (!perfil || loading) {
    return <div className="mt-10 text-center">Cargando perfil...</div>;
  }

  if ((!perfil && !loading) || (error && !perfil)) {
    return (
      <div className="mt-10 text-center text-red-600">
        {error || "No se pudo cargar el perfil."}
        <button className="ml-4 underline" onClick={logout}>
          Volver a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0),
          conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0) 60px 60px,
          conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0) calc(2 * 60px) calc(2 * 60px),
          conic-gradient(at 50% 25%, #0000 75%, #47d3ff 0) calc(3 * 60px) calc(3 * 60px),
          repeating-linear-gradient(135deg, #adafff 0 12.5%, #474bff 0 25%)`,
        backgroundSize: "calc(4 * 60px) calc(4 * 60px)",
      }}
    >
      <div className="max-w-md w-full p-8 bg-white bg-opacity-95 rounded-xl shadow-lg z-10 backdrop-blur-[2px]">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Mi Perfil</h2>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {!editando ? (
          <div>
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">
                Usuario:
              </span>
              <span className="block text-lg">{perfil?.username}</span>
            </div>
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">Email:</span>
              <span className="block text-lg">{perfil.email}</span>
            </div>
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">Nombre:</span>
              <span className="block text-lg">{perfil.nombre}</span>
            </div>
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">
                Apellido:
              </span>
              <span className="block text-lg">{perfil.apellido}</span>
            </div>
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">
                Fecha de registro:
              </span>
              <span className="block text-lg">
                {formatearFecha(perfil.fecha_registro)}
              </span>
            </div>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded font-semibold mt-2 hover:bg-blue-700 transition"
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleGuardar} className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, nombre: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Apellido</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, apellido: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                Guardar cambios
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        <div className="mt-6">
          <button
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
            onClick={() => navigate("/cambiar-contrasena")}
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
