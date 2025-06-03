import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [backendError, setBackendError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setBackendError(false);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:4040/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          nombre,
          apellido,
          rol: "user",
        }),
      });

      if (res.ok) {
        alert("Cuenta creada con éxito. Ahora podés iniciar sesión.");
        navigate("/signin");
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorJson = await res.json();
          setErrorMsg(errorJson.mensaje || JSON.stringify(errorJson));
        } else {
          const errorText = await res.text();
          setErrorMsg(errorText || "Datos inválidos o cuenta ya existe.");
        }
      }
    } catch (error) {
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
          alt="Error 500"
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
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded relative"
    >
      {/* Link a login arriba */}
      <button
        onClick={() => navigate("/signin")}
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
      <h2 className="text-xl font-bold mb-4 text-center">Crear cuenta</h2>

      {errorMsg && (
        <div className="mb-4 text-red-600 text-center bg-red-100 p-2 rounded">
          {errorMsg}
        </div>
      )}

      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Registrarse
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tenés cuenta?{" "}
        <Link
          to="/signin"
          className="text-primary hover:text-secondary font-semibold"
        >
          Iniciá sesión acá
        </Link>
      </p>
    </form>
  );
}
