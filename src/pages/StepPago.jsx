import { motion } from "framer-motion";
import CreditCard from "../components/CreditCard";
import React, { useState } from "react";

export default function StepPago({
  envio,
  direcciones,
  direccionId,
  setDireccionId,
  carrito,
  imagenesProductos,
  card,
  setCard,
  calcularTotal,
  handlePagar,
  loading,
  error,
  cancelarPago,
  setStep,
}) {
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Detecta tipo de tarjeta por el número (simple: Visa, MasterCard, Amex)
  const getCardType = (number) => {
    const n = number.replace(/\s/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^5[1-5]/.test(n)) return "MasterCard";
    if (/^3[47]/.test(n)) return "American Express";
    return "";
  };

  // Validaciones de tarjeta
  const validateCard = () => {
    const errors = {};
    const number = card.number.replace(/\s/g, "");
    if (!/^\d{16}$/.test(number)) {
      errors.number = "El número debe tener 16 dígitos numéricos (sin letras).";
    }
    if (!card.name.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(card.name.trim())) {
      errors.name = "Solo letras y espacios. Ej: Juan Pérez";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
      errors.expiry = "Formato MM/AA. Ej: 09/27";
    }
    if (!/^\d{3,4}$/.test(card.cvv)) {
      errors.cvv = "3 o 4 dígitos numéricos.";
    }
    setFieldErrors(errors);
    setFormError("");
    return Object.keys(errors).length === 0;
  };

  const validateDireccion = () => {
    if (envio && !direccionId) {
      setFormError("Seleccioná una dirección de envío.");
      return false;
    }
    return true;
  };

  const validateCarrito = () => {
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      setFormError("El carrito está vacío.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCarrito()) return;
    if (!validateDireccion()) return;
    if (!validateCard()) return;
    setFormError("");
    handlePagar(e);
  };

  const total =
    carrito && typeof carrito.total === "number" ? carrito.total : 0;

  const cardType = getCardType(card.number);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Selector de dirección si es envío */}
      {envio && (
        <div className="mb-4">
          <label className="font-semibold block mb-2 text-gray-800">
            Dirección de envío
          </label>
          <select
            className="w-full border rounded p-2"
            value={direccionId}
            onChange={(e) => setDireccionId(e.target.value)}
            required
          >
            <option value="">Seleccioná una dirección</option>
            {direcciones.map((d) => (
              <option key={d.id} value={d.id}>
                {d.calle} {d.numero}, {d.ciudad} ({d.codigoPostal})
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Resumen de compra */}
      <div className="mb-8">
        <div className="font-bold text-xl mb-2 text-blue-700">
          Productos en tu compra
        </div>
        <div className="rounded-xl border border-blue-100 bg-gray-50 shadow-sm overflow-x-auto">
          {carrito?.items?.length === 0 && (
            <div className="p-6 text-gray-400 text-center">
              Tu carrito está vacío.
            </div>
          )}
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="py-3 px-4 text-left">Producto</th>
                <th className="py-3 px-4 text-left">Cantidad</th>
                <th className="py-3 px-4 text-right">Precio c/u</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito?.items?.map((item) => (
                <tr
                  key={item.productoId}
                  className="border-t last:border-b-0 border-blue-100 hover:bg-blue-50"
                >
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={imagenesProductos[item.productoId] || ""}
                      alt={item.nombreProducto}
                      className="w-14 h-14 rounded shadow border border-blue-200 object-cover"
                      style={{ background: "#fff" }}
                    />
                    <div>
                      <div className="font-semibold">{item.nombreProducto}</div>
                      <div className="text-sm text-gray-500">
                        {item.marca || ""}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{item.cantidad}</td>
                  <td className="py-3 px-4 text-right">
                    {/* Mostrar precio unitario */}
                    {item.precioUnitario !== undefined && item.precioUnitario !== null
                      ? `$${Number(item.precioUnitario).toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700">
                    {/* Mostrar subtotal calculado si no viene del backend */}
                    {item.subtotal !== undefined && item.subtotal !== null
                      ? `$${Number(item.subtotal).toFixed(2)}`
                      : (item.precioUnitario !== undefined && item.cantidad !== undefined
                        ? `$${(Number(item.precioUnitario) * Number(item.cantidad)).toFixed(2)}`
                        : "-")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Tarjeta de crédito */}
      <form className="mb-6" onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-5">
          <CreditCard
            cardNumber={card.number}
            name={card.name}
            expiry={card.expiry}
            cvv={card.cvv}
            cardType={cardType}
          />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Número de tarjeta{" "}
            {cardType && (
              <span className="ml-2 text-xs text-blue-600">({cardType})</span>
            )}
          </label>
          <input
            type="text"
            placeholder="Ej: 4111 1111 1111 1111"
            maxLength={19}
            value={card.number}
            onChange={(e) =>
              setCard({
                ...card,
                number: e.target.value.replace(/[^\d\s]/g, ""),
              })
            }
            className={`border rounded p-2 ${
              fieldErrors.number ? "border-red-400" : ""
            }`}
            required
            disabled={loading}
            inputMode="numeric"
            autoComplete="cc-number"
          />
          {fieldErrors.number && (
            <div className="text-xs text-red-600 mb-1">
              {fieldErrors.number}
            </div>
          )}

          <label className="text-sm font-medium text-gray-700 mb-1">
            Nombre en la tarjeta
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            className={`border rounded p-2 ${
              fieldErrors.name ? "border-red-400" : ""
            }`}
            required
            disabled={loading}
            autoCapitalize="words"
            autoComplete="cc-name"
          />
          {fieldErrors.name && (
            <div className="text-xs text-red-600 mb-1">
              {fieldErrors.name}
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Vencimiento
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                maxLength={5}
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                className={`border rounded p-2 w-full ${
                  fieldErrors.expiry ? "border-red-400" : ""
                }`}
                required
                disabled={loading}
                pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                autoComplete="cc-exp"
              />
              {fieldErrors.expiry && (
                <div className="text-xs text-red-600 mb-1">
                  {fieldErrors.expiry}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="password"
                placeholder="Ej: 123"
                maxLength={4}
                value={card.cvv}
                onChange={(e) =>
                  setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })
                }
                className={`border rounded p-2 w-full ${
                  fieldErrors.cvv ? "border-red-400" : ""
                }`}
                required
                disabled={loading}
                inputMode="numeric"
                pattern="\d{3,4}"
                autoComplete="cc-csc"
              />
              {fieldErrors.cvv && (
                <div className="text-xs text-red-600 mb-1">
                  {fieldErrors.cvv}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Errores de validación */}
        {formError && (
          <div className="mb-3 text-center bg-red-100 text-red-700 rounded p-2">
            {formError}
          </div>
        )}
        {/* Resumen total */}
        <div className="mb-3 font-bold text-xl text-right text-green-700">
          Total: ${" "}
          {typeof calcularTotal === "function"
            ? (typeof calcularTotal() === "number"
                ? calcularTotal().toLocaleString("es-AR")
                : "0")
            : carrito && typeof carrito.total === "number"
            ? carrito.total.toLocaleString("es-AR")
            : "0"}
          {envio && (
            <span className="ml-2 text-sm text-gray-500">
              (Incluye envío: $2000)
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => setStep(1)}
            disabled={loading}
          >
            Volver
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg transition disabled:opacity-60"
            disabled={loading || (envio && !direccionId)}
          >
            {loading ? "Procesando..." : "Pagar"}
          </button>
          {loading && (
            <button
              type="button"
              className="px-4 py-2 ml-4 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={cancelarPago}
            >
              Cancelar
            </button>
          )}
        </div>
        {error && (
          <div className="mt-3 text-center bg-red-100 text-red-700 rounded p-2">
            {error}
          </div>
        )}
      </form>
    </motion.div>
  );
}
