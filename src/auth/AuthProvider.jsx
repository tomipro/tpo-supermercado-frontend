import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Este componente envuelve toda la app y comparte el estado de autenticación
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null); // Guarda el JWT

  const [usuario, setUsuario] = useState(null); // Guarda el usuario autenticado

  // Funciones para iniciar sesion
  const login = ({ jwt, usuario }) => {
    setToken(jwt); // Guarda el token JWT
    setUsuario(usuario); // Guarda el usuario autenticado
  };

  // Función para cerrar sesion
  const logout = () => {
    setToken(null);
    setUsuario(null); // Limpia el usuario al cerrar sesión
  };

  const isAuthenticated = !!token; // Verifica si hay un token
  return (
    <AuthContext.Provider
      value={{ token, usuario, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// Hook para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}
