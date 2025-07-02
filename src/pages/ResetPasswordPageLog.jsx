import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cambiarPasswordLogThunk, clearAuthError } from "../redux/authSlice";

export default function ResetPasswordPageLog() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    dispatch(
      cambiarPasswordLogThunk({
        token,
        contrasenaActual: oldPassword,
        nuevaContrasena: newPassword,
      })
    )
      .unwrap()
      .then((text) => {
        setMsg(text || "Contraseña cambiada correctamente.");
        setOldPassword("");
        setNewPassword("");
      });
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
          disabled={loading}
        >
          {loading ? "Cambiando..." : "Cambiar contraseña"}
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
