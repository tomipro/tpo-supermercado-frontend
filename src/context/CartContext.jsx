import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [carrito, setCarrito] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  // Carga el carrito cada vez que cambia el token
  useEffect(() => {
    if (!token) {
      setCarrito({ items: [], total: 0 });
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("http://localhost:4040/carritos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.ok ? res.json() : { items: [], total: 0 })
      .then((data) => {
        if (!data || typeof data !== "object" || !Array.isArray(data.items)) {
          setCarrito({ items: [], total: 0 });
        } else {
          setCarrito(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setCarrito({ items: [], total: 0 });
        setLoading(false);
      });
  }, [token]);

  // Permite refrescar el carrito desde cualquier lugar
  const refreshCarrito = () => {
    setLoading(true);
    fetch("http://localhost:4040/carritos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.ok ? res.json() : { items: [], total: 0 })
      .then((data) => {
        if (!data || typeof data !== "object" || !Array.isArray(data.items)) {
          setCarrito({ items: [], total: 0 });
        } else {
          setCarrito(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setCarrito({ items: [], total: 0 });
        setLoading(false);
      });
  };

  return (
    <CartContext.Provider value={{ carrito, loading, refreshCarrito }}>
      {children}
    </CartContext.Provider>
  );
}
