import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { usuario, token, logout, login } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPerfil() {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:4040/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPerfil(data);
          setFormData({
            email: data.email,
            nombre: data.nombre,
            apellido: data.apellido,
          });
        } else {
          let mensaje = "Ocurrió un error al cargar el perfil.";
          try {
            const errorJson = await res.json();
            mensaje = errorJson.mensaje || mensaje;
          } catch {
            try {
              const errorText = await res.text();
              if (errorText) mensaje = errorText;
            } catch {}
          }
          setError(mensaje);
        }
      } catch (e) {
        setError(e.message || "Error de red.");
      }
    }
    fetchPerfil();
  }, [token]);

  async function handleGuardar(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!perfil?.id) {
      setError("No se encontró el ID del usuario.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4040/usuarios/${perfil.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPerfil(updated);
        setSuccess("Perfil actualizado correctamente.");
        setEditando(false);
        // Actualizar usuario global (navbar, etc)
        login({ jwt: token, usuario: updated });
      } else {
        let mensaje = "Error al actualizar el perfil.";
        try {
          const data = await res.json();
          mensaje = data.mensaje || mensaje;
        } catch {
          const text = await res.text();
          if (text) mensaje = text;
        }
        setError(mensaje);
      }
    } catch (e) {
      setError(e.message || "Error de red.");
    }
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
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        {!perfil ? (
          <div className="text-center text-gray-500 py-8">
            Cargando perfil...
          </div>
        ) : !editando ? (
          <div>
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">
                Usuario:
              </span>
              <span className="block text-lg">{perfil.username}</span>
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
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded font-semibold mt-2 hover:bg-blue-700 transition"
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>
            {success && (
              <div className="bg-green-100 text-green-700 p-2 rounded mt-2">
                {success}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleGuardar} className="flex flex-col gap-3">
            <label>
              <span className="text-gray-600 font-semibold">Email:</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border p-2 rounded mt-1"
                required
              />
            </label>
            <label>
              <span className="text-gray-600 font-semibold">Nombre:</span>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full border p-2 rounded mt-1"
                required
              />
            </label>
            <label>
              <span className="text-gray-600 font-semibold">Apellido:</span>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                className="w-full border p-2 rounded mt-1"
                required
              />
            </label>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded font-semibold hover:bg-blue-700 transition"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 py-2 px-6 rounded font-semibold"
                onClick={() => {
                  setEditando(false);
                  setFormData({
                    email: perfil.email,
                    nombre: perfil.nombre,
                    apellido: perfil.apellido,
                  });
                  setError("");
                  setSuccess("");
                }}
              >
                Cancelar
              </button>
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded mt-2">
                {error}
              </div>
            )}
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
