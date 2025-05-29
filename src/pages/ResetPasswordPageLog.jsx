import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function ResetPasswordPageLog() {
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const res = await fetch("http://localhost:4040/usuarios/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contrasenaActual: oldPassword,
          nuevaContrasena: newPassword,
        }),
      });
      const text = await res.text();
      if (res.ok) {
        setMsg(text || "Contraseña cambiada correctamente.");
        setOldPassword("");
        setNewPassword("");
      } else {
        setError(text || "Error al cambiar la contraseña.");
      }
    } catch (err) {
      setError("Error de red.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Cambiar contraseña
        </button>
      </form>
      {msg && (
        <div className="bg-green-100 text-green-700 p-2 rounded mt-2">
          {msg}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mt-2">{error}</div>
      )}
    </div>
  );
}
