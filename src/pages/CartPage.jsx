import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import dinoPensativo from "../assets/dino_pensativo.png";
import { useCart } from "../context/CartContext";

// Muestra un mensaje  y imagen del dino cuando el carrito está vacío
function CarritoVacio() {
  return (
    <div className="flex flex-col items-center justify-center mt-16 mb-16">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180 }}
        className="mb-4"
      >
        <img
          src={dinoPensativo}
          alt="Carrito vacío Rex"
          width={230}
          height={200}
          className="mx-auto drop-shadow-lg"
          draggable={false}
          style={{
            maxWidth: 280,
            maxHeight: 220,
            objectFit: "contain",
            background: "none",
          }}
        />
      </motion.div>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-bold text-blue-700 mb-2"
      >
        ¡Tu carrito está vacío!
      </motion.h2>
      <motion.p className="text-base text-gray-600 mb-8">
        Agregá productos y viví la mejor experiencia de compra :)
      </motion.p>
      <Link
        to="/buscar"
        className="inline-block px-6 py-3 rounded-full font-bold bg-blue-600 hover:bg-blue-700 shadow-lg transition-all text-lg text-white"
        style={{ color: "#fff" }}
      >
        Buscar productos
      </Link>
    </div>
  );
}

// Página principal del carrito
export default function CartPage() {
  // Estado principal del carrito y su carga
  const { carrito, setCarrito, loading, error, refreshCarrito } = useCart();
  const [imagenesProductos, setImagenesProductos] = useState({});
  const { token } = useAuth();
  const navigate = useNavigate();

  // Trae el carrito al cargar la página o cuando cambia el token
  useEffect(() => {
    refreshCarrito();
    // eslint-disable-next-line
  }, [token]);

  // Trae imágenes de los productos del carrito (si hace falta)
  useEffect(() => {
    if (!carrito || !carrito.items) return;

    carrito.items.forEach((item) => {
      if (!imagenesProductos[item.productoId]) {
        fetch(`http://localhost:4040/producto/id/${item.productoId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && data.imagenes && data.imagenes.length > 0) {
              setImagenesProductos((prev) => ({
                ...prev,
                [item.productoId]: data.imagenes[0],
              }));
            }
          })
          .catch(() => {});
      }
    });
    // eslint-disable-next-line
  }, [carrito]);

  // Disminuye cantidad o elimina si queda solo uno
  const handleDecrement = async (item) => {
    try {
      const res = await fetch(
        `http://localhost:4040/carritos/${item.productoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("No se pudo eliminar/restar el producto.");
      await res.json();
      await refreshCarrito(); // Espera a que el contexto se actualice antes de continuar
    } catch (e) {
      setError("No se pudo eliminar/restar el producto. Intenta de nuevo.");
    }
  };

  // Cambia la cantidad de un producto en el carrito (+1)
  const handleChangeCantidad = async (productoId, change) => {
    try {
      const res = await fetch(
        `http://localhost:4040/carritos/${productoId}?cantidad=${change}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("No se pudo modificar la cantidad.");
      await res.json();
      await refreshCarrito();
    } catch (e) {
      setError("No se pudo modificar la cantidad. Intenta de nuevo.");
    }
  };

  // Elimina un producto del carrito
  const handleEliminar = async (productoId) => {
    const item = carrito.items.find((i) => i.productoId === productoId);
    const cantidadAEliminar = item ? item.cantidad : 1;
    try {
      const res = await fetch(
        `http://localhost:4040/carritos/${productoId}?cantidad=${cantidadAEliminar}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("No se pudo eliminar el producto.");
      await res.json();
      await refreshCarrito();
    } catch (e) {
      setError("No se pudo eliminar el producto. Intenta de nuevo.");
    }
  };

  // Va a la página de pago
  const irAPago = () => {
    navigate("/finalizar-compra");
  };

  // Carga inicial y errores
  if (loading)
    return <div className="mt-10 text-center">Cargando carrito...</div>;
  if (error)
    return <div className="mt-10 text-center text-red-600">{error}</div>;

  // Si el carrito está vacío, muestra el mensaje con el dino
  if (!carrito || !carrito.items || carrito.items.length === 0)
    return <CarritoVacio />;

  // Carrito con productos (tabla y controles)
  return (
    <div className="max-w-5xl mx-auto mt-12 flex flex-col md:flex-row gap-8">
      {/* Lista de productos */}
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-700 flex items-center gap-2">
          <FaShoppingCart className="inline mr-2" />
          Mi Carrito
        </h1>
        <div className="bg-white rounded-xl shadow border border-blue-200 overflow-hidden">
          <AnimatePresence>
            {carrito.items.map((item) => (
              <motion.div
                key={item.productoId}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="flex flex-col sm:flex-row items-center gap-4 px-6 py-5 border-b border-blue-100 last:border-b-0 hover:bg-blue-50 transition"
              >
                {/* Imagen producto */}
                <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden border border-blue-200">
                  <img
                    src={imagenesProductos[item.productoId] || ""}
                    alt={item.nombreProducto}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Info principal */}
                <div className="flex-1 w-full sm:w-auto">
                  <div className="font-bold text-lg text-gray-800">
                    {item.nombreProducto}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Cantidad:{" "}
                    <span className="font-semibold">{item.cantidad}</span>
                  </div>
                </div>
                {/* Controles de cantidad */}
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 bg-blue-200 rounded-full hover:bg-blue-300 transition"
                    onClick={() => handleDecrement(item)}
                  >
                    <FaMinus size={14} />
                  </button>
                  <button
                    className="p-2 bg-blue-200 rounded-full hover:bg-blue-300 transition"
                    onClick={() => handleChangeCantidad(item.productoId, 1)}
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
                {/* Precio unitario and subtotal */}
                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                  <div className="text-sm text-gray-500">Precio c/u</div>
                  <div className="font-semibold text-base text-blue-700">
                    {item.precioUnitario !== undefined && item.precioUnitario !== null
                      ? `$${Number(item.precioUnitario).toFixed(2)}`
                      : "-"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.precioUnitario !== undefined && item.precioUnitario !== null
                      ? `Sin IVA: $${Math.round(Number(item.precioUnitario) / 1.21)}`
                      : ""}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                  <div className="text-sm text-gray-500">Subtotal</div>
                  <div className="font-bold text-lg text-green-700">
                    {item.subtotal !== undefined && item.subtotal !== null
                      ? `$${Number(item.subtotal).toFixed(2)}`
                      : (item.precioUnitario !== undefined && item.cantidad !== undefined
                        ? `$${(Number(item.precioUnitario) * Number(item.cantidad)).toFixed(2)}`
                        : "-")}
                  </div>
                  <div className="text-xs text-gray-400 font-normal">
                    {(item.precioUnitario !== undefined && item.cantidad !== undefined)
                      ? `Sin IVA: $${Math.round((Number(item.precioUnitario) * Number(item.cantidad)) / 1.21)}`
                      : ""}
                  </div>
                </div>
                {/* Eliminar producto */}
                <button
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
                  onClick={() => handleEliminar(item.productoId)}
                  title="Eliminar producto"
                >
                  <FaTrash />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Total del carrito */}
          <div className="flex flex-col gap-1 justify-end items-end px-6 py-4 border-t border-blue-100 bg-blue-50">
            <div className="flex gap-4 items-center">
              <span className="font-semibold text-gray-700 text-lg">Total:</span>
              <span className="font-bold text-2xl text-green-700">
                {(carrito.total !== undefined && carrito.total !== null && !isNaN(Number(carrito.total)))
                  ? `$${Number(carrito.total).toFixed(2)}`
                  : (() => {
                      const total = carrito.items.reduce((sum, item) => {
                        if (item.subtotal !== undefined && item.subtotal !== null && !isNaN(Number(item.subtotal))) {
                          return sum + Number(item.subtotal);
                        }
                        if (item.precioUnitario !== undefined && item.cantidad !== undefined) {
                          return sum + (Number(item.precioUnitario) * Number(item.cantidad));
                        }
                        return sum;
                      }, 0);
                      return `$${total.toFixed(2)}`;
                    })()
                }
              </span>
            </div>
            <div className="flex gap-4 items-center text-[14px] text-gray-500">
              <span>Sin IVA (21%):</span>
              <span>
                {(() => {
                  let total = 0;
                  if (carrito.total !== undefined && carrito.total !== null && !isNaN(Number(carrito.total))) {
                    total = Number(carrito.total);
                  } else {
                    total = carrito.items.reduce((sum, item) => {
                      if (item.subtotal !== undefined && item.subtotal !== null && !isNaN(Number(item.subtotal))) {
                        return sum + Number(item.subtotal);
                      }
                      if (item.precioUnitario !== undefined && item.cantidad !== undefined) {
                        return sum + (Number(item.precioUnitario) * Number(item.cantidad));
                      }
                      return sum;
                    }, 0);
                  }
                  return `$${Math.round(total / 1.21)}`;
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen del pedido y botón de pago */}
      <aside className="md:w-80 w-full">
        <motion.div
          className="bg-white rounded-xl shadow border border-blue-200 p-6 sticky top-24"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-bold mb-3 text-blue-700">Resumen</h2>
          <div className="flex justify-between text-gray-700 text-base mb-1">
            <span>Cantidad de ítems</span>
            <span>
              {carrito.items.reduce((sum, item) => sum + item.cantidad, 0)}
            </span>
          </div>
          <div className="flex justify-between text-gray-700 text-base mb-1">
            <span>Total</span>
            <span className="font-bold text-green-700">
              {(carrito.total !== undefined && carrito.total !== null && !isNaN(Number(carrito.total)))
                ? `$${Number(carrito.total).toFixed(2)}`
                : (() => {
                    const total = carrito.items.reduce((sum, item) => {
                      if (item.subtotal !== undefined && item.subtotal !== null && !isNaN(Number(item.subtotal))) {
                        return sum + Number(item.subtotal);
                      }
                      if (item.precioUnitario !== undefined && item.cantidad !== undefined) {
                        return sum + (Number(item.precioUnitario) * Number(item.cantidad));
                      }
                      return sum;
                    }, 0);
                    return `$${total.toFixed(2)}`;
                  })()
              }
            </span>
          </div>
          {/* Ir a pagar */}
          <button
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            onClick={irAPago}
          >
            <FaShoppingCart />
            Finalizar compra
          </button>
          <div className="mt-4 text-xs text-gray-400 text-center">
            * No incluye envío.
          </div>
        </motion.div>
      </aside>
    </div>
  );
}
