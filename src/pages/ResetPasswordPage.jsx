import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [emailValidado, setEmailValidado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verificarEmail = async () => {
    try {
      const res = await fetch(
        `http://localhost:4040/usuarios/exists/email/${encodeURIComponent(
          email
        )}`
      );
      const existe = await res.json();
      if (existe) {
        setEmailValidado(true);
        setError("");
      } else {
        setError("No se encontró ningún usuario con ese correo.");
      }
    } catch (err) {
      setError("Error al verificar el correo.");
    }
  };

  const cambiarContrasena = async () => {
    try {
      const res = await fetch(
        `http://localhost:4040/usuarios/cambiar-password?email=${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nuevaContrasena }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error desconocido.");
      }

      const msg = await res.text();
      setMensaje(msg + " Serás redirigido al inicio de sesión en 5 segundos.");
      setError("");

      // Redireccionar después de 5 segundos
      setTimeout(() => {
        navigate("/signin");
      }, 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Recuperar Contraseña</h2>

      {!emailValidado ? (
        <>
          <input
            type="email"
            placeholder="Ingresá tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
            required
          />
          <button
            onClick={verificarEmail}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Verificar correo
          </button>
        </>
      ) : (
        <>
          <p className="mb-4 text-gray-600">Correo verificado: {email}</p>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
            required
          />
          <button
            onClick={cambiarContrasena}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Cambiar contraseña
          </button>
        </>
      )}

      {mensaje && (
        <div className="bg-green-100 text-green-700 p-2 rounded mt-4">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mt-4">{error}</div>
      )}
    </div>
  );
}
