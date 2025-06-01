import { motion } from "framer-motion";
import CreditCard from "../components/CreditCard";

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
                      src={
                        imagenesProductos[item.productoId] || "/placeholder.jpg"
                      }
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
                    ${item.precioUnitario?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700">
                    ${item.subtotal?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Tarjeta de crédito */}
      <form className="mb-6" onSubmit={handlePagar}>
        <div className="mb-5">
          <CreditCard
            cardNumber={card.number}
            name={card.name}
            expiry={card.expiry}
            cvv={card.cvv}
          />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Número de tarjeta"
            maxLength={19}
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            className="border rounded p-2"
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Nombre en la tarjeta"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            className="border rounded p-2"
            required
            disabled={loading}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="MM/AA"
              maxLength={5}
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              className="border rounded p-2 w-1/2"
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="CVV"
              maxLength={4}
              value={card.cvv}
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              className="border rounded p-2 w-1/2"
              required
              disabled={loading}
            />
          </div>
        </div>
        {/* Resumen total */}
        <div className="mb-3 font-bold text-xl text-right text-green-700">
          Total: ${calcularTotal().toLocaleString("es-AR")}
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
