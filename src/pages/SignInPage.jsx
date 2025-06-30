import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, clearAuthError } from "../redux/authSlice";

export default function SignInPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginThunk({ username: usuario, password }));
  };

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
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mt-3">
            {error}
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
