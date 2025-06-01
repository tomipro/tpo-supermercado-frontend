import { motion } from "framer-motion";

export default function StepEntrega({
  envio,
  direcciones,
  handleSeleccionMetodo,
}) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <label className="font-semibold block mb-4 text-lg text-gray-700 text-center">
          ¿Cómo querés recibir tu compra?
        </label>
        <div className="flex justify-center gap-8">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-full font-bold text-lg shadow-md hover:bg-green-700 transition"
            onClick={() => handleSeleccionMetodo("retiro")}
          >
            Retiro en local{" "}
            <span className="text-xs text-gray-200">(sin costo)</span>
          </button>
          <button
            className={`px-6 py-3 bg-blue-600 text-white rounded-full font-bold text-lg shadow-md hover:bg-blue-700 transition ${
              direcciones.length === 0 ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={direcciones.length === 0}
            onClick={() => handleSeleccionMetodo("envio")}
          >
            Envío a domicilio{" "}
            <span className="text-xs text-gray-200">(+ $2000)</span>
          </button>
        </div>
        {envio && direcciones.length === 0 && (
          <div className="mt-6 text-center text-red-600 font-semibold">
            No tenés direcciones cargadas. <br />
            <span className="text-gray-700 text-sm">
              Agregá una dirección desde tu perfil antes de seleccionar envío a
              domicilio.
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
