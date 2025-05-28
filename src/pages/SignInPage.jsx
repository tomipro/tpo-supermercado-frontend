import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Link } from "react-router-dom";

export default function SignInPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  // Estado para manejar errores del backend
  const [errorMsg, setErrorMsg] = useState("");
  const [backendError, setBackendError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBackendError(false);
    setErrorMsg(""); // Limpiar error anterior

    try {
      const res = await fetch("http://localhost:4040/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usuario,
          password: password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const { token, usuario } = data;
        login({ jwt: token, usuario });
        navigate("/");
      } else {
        // Si el backend responde con 401 o 403, mostramos mensaje personalizado
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorJson = await res.json();
          setErrorMsg(errorJson.mensaje || "Error desconocido.");
        } else {
          const errorMsg = await res.text();
          setErrorMsg(errorMsg || "Error desconocido.");
        }
      }
    } catch (error) {
      // Solo si es un error real de red (backend caído, CORS, etc)
      console.error("Error de red:", error);
      setBackendError(true);
    }
  };

  if (backendError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ¡El sistema se cayó!
        </h2>
        <img
          src="https://pbs.twimg.com/media/DppUek3UUAEciTl.jpg"
          alt="Error gracioso"
          className="w-80 rounded shadow"
        />
        <p className="mt-4 text-gray-600">
          Parece que el backend no está disponible.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Iniciar sesión
      </button>
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {errorMsg}
        </div>
      )}
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Olvidaste tu contraseña?{" "}
        <Link to="/reset-password" className="text-blue-600 hover:underline">
          Recuperala acá
        </Link>
      </p>
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tenés cuenta? <Link to="/signup">Registrate acá</Link>
      </p>
    </form>
  );
}
