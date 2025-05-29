import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function SignInPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [backendError, setBackendError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBackendError(false);
    setErrorMsg("");
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
    <div
      className="max-w-md mx-auto relative overflow-hidden z-10 bg-white p-8 rounded-lg shadow-md
        before:w-24 before:h-24 before:absolute before:bg-blue-100 before:rounded-full before:-z-10 before:blur-2xl
        after:w-32 after:h-32 after:absolute after:bg-blue-200 after:rounded-full after:-z-10 after:blur-xl after:top-24 after:-right-12"
    >
      {/* Link volver atrás */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 p-2 rounded-full text-blue-500 hover:bg-blue-100 transition"
        title="Volver"
        type="button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Iniciar sesión
      </h2>
      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="input mt-1 p-2 w-full bg-gray-100 border border-blue-300 rounded-md text-blue-900 mb-4 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mt-1 p-2 w-full bg-gray-100 border border-blue-300 rounded-md text-blue-900 mb-4 focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="login-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-bold rounded-md w-full transition mt-2"
        >
          Iniciar sesión
        </button>
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded mt-3">
            {errorMsg}
          </div>
        )}
        <p className="mt-4 text-center text-sm text-gray-500">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/reset-password" className="text-blue-600 hover:underline">
            Recuperala acá
          </Link>
        </p>
      </form>

      {/* Botón "Crear cuenta" GRANDE */}
      <div className="flex flex-col mt-6">
        <span className="text-center text-gray-500 mb-2">
          ¿No tenés cuenta?
        </span>
        <Link
          to="/signup"
          className="w-full bg-white border border-blue-500 text-blue-700 font-bold py-2 rounded-md text-center hover:bg-blue-50 transition"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
