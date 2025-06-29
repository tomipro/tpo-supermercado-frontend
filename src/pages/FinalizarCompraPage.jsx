import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import StepEntrega from "./StepEntrega";
import StepPago from "./StepPago";
import StepComprobante from "./StepComprobante";
import { AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { fetchCarrito } from "../redux/cartSlice";

export default function FinalizarCompraPage() {
  // Hook de autenticación, trae el token del usuario logueado
  const { token } = useAuth();
  const dispatch = useDispatch();
  const carrito = useSelector((state) => state.cart.carrito);

  // Estados principales del flujo de compra
  const [direcciones, setDirecciones] = useState([]); // Direcciones guardadas del usuario
  const [direccionId, setDireccionId] = useState(""); // Dirección seleccionada para envío
  const [envio, setEnvio] = useState(false); // true si se elige envío a domicilio
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  }); // Estado de los campos de la tarjeta de crédito
  const [loading, setLoading] = useState(false); // Carga/espera al pagar
  const [msg, setMsg] = useState(""); // Mensaje de éxito
  const [error, setError] = useState(""); // Mensaje de error
  const [orden, setOrden] = useState(null); // Orden generada al finalizar compra
  const [imagenesProductos, setImagenesProductos] = useState({}); // Imagen de cada producto del carrito
  const [step, setStep] = useState(1); // Step actual del flujo (1: entrega, 2: pago, 3: comprobante)
  const [cancelTimeout, setCancelTimeout] = useState(null); // Permite cancelar el pago mientras está "procesando"

  /**
   * Carga las direcciones guardadas del usuario al cargar el componente o si cambia el token.
   */
  useEffect(() => {
    fetch("http://localhost:4040/direcciones", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDirecciones(data))
      .catch(() => setError("No se pudieron cargar las direcciones"));
  }, [token]);

  /**
   * Carga el carrito del usuario logueado al cargar el componente o si cambia el token.
   */
  useEffect(() => {
    if (token) dispatch(fetchCarrito(token));
    // eslint-disable-next-line
  }, [token, dispatch]);

  /**
   * Por cada producto del carrito, obtiene la imagen (si no la tiene ya) para mostrar en el resumen.
   */
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

  /**
   * Calcula el total final de la compra (sumando $2000 si hay envío).
   */
  const calcularTotal = () => {
    if (!carrito || !Array.isArray(carrito.items) || carrito.items.length === 0)
      return 0;
    // Sumar subtotales de los items si carrito.total no es válido
    let total = 0;
    if (typeof carrito.total === "number" && !isNaN(carrito.total)) {
      total = carrito.total;
    } else {
      total = carrito.items.reduce((sum, item) => {
        if (
          item.subtotal !== undefined &&
          item.subtotal !== null &&
          !isNaN(Number(item.subtotal))
        ) {
          return sum + Number(item.subtotal);
        }
        if (item.precioUnitario !== undefined && item.cantidad !== undefined) {
          return sum + Number(item.precioUnitario) * Number(item.cantidad);
        }
        return sum;
      }, 0);
    }
    return envio ? total + 2000 : total;
  };

  /**
   * Maneja la selección de método de entrega. Si elige envío y tiene direcciones, avanza al paso 2.
   */
  const handleSeleccionMetodo = (tipo) => {
    if (tipo === "retiro") {
      setEnvio(false);
      setDireccionId("");
      setStep(2);
    } else {
      setEnvio(true);
      if (direcciones.length > 0) setStep(2);
    }
  };

  /**
   * Realiza el "pago" (simula espera). Cuando termina, genera la orden y pasa al comprobante.
   */
  const handlePagar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    const timeout = setTimeout(async () => {
      try {
        const body = envio ? { direccionId } : {};
        const res = await fetch("http://localhost:4040/ordenes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("No se pudo finalizar la compra");
        const ordenGenerada = await res.json();

        // Si es envío, agregar la dirección seleccionada al objeto orden para mostrarla en el comprobante
        let direccionElegida = null;
        if (envio && direccionId && Array.isArray(direcciones)) {
          direccionElegida = direcciones.find(
            (d) => String(d.id) === String(direccionId)
          );
        }
        setOrden({
          ...ordenGenerada,
          direccion:
            envio && direccionElegida
              ? `${direccionElegida.calle} ${direccionElegida.numero}${
                  direccionElegida.pisoDepto
                    ? " Piso/Depto: " + direccionElegida.pisoDepto
                    : ""
                }, ${direccionElegida.ciudad}, ${direccionElegida.provincia} (${
                  direccionElegida.codigoPostal
                })`
              : ordenGenerada.direccion || "Retiro en local",
        });

        setMsg("¡Compra realizada con éxito!");
        setStep(3);
        await dispatch(fetchCarrito(token));
      } catch (e) {
        setError(e.message || "Error en el pago");
      } finally {
        setLoading(false);
        setCancelTimeout(null);
      }
    }, 2500);
    setCancelTimeout(timeout);
  };

  /**
   * Permite cancelar el pago si está "procesando".
   */
  const cancelarPago = () => {
    clearTimeout(cancelTimeout);
    setLoading(false);
    setCancelTimeout(null);
  };

  // Renderiza cada step según el estado actual
  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg">
      {step !== 3 && (
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">
          Finalizar compra
        </h2>
      )}
      <AnimatePresence mode="wait">
        {/* Paso 1: Selección de método de entrega */}
        {step === 1 && (
          <StepEntrega
            envio={envio}
            direcciones={direcciones}
            handleSeleccionMetodo={handleSeleccionMetodo}
          />
        )}
        {/* Paso 2: Resumen y pago */}
        {step === 2 && (
          <StepPago
            envio={envio}
            direcciones={direcciones}
            direccionId={direccionId}
            setDireccionId={setDireccionId}
            carrito={carrito}
            imagenesProductos={imagenesProductos}
            card={card}
            setCard={setCard}
            calcularTotal={calcularTotal}
            handlePagar={handlePagar}
            loading={loading}
            error={error}
            cancelarPago={cancelarPago}
            setStep={setStep}
          />
        )}
        {/* Paso 3: Comprobante */}
        {step === 3 && orden && orden.items && Array.isArray(orden.items) && (
          <StepComprobante orden={orden} envio={envio} />
        )}
      </AnimatePresence>
    </div>
  );
}
