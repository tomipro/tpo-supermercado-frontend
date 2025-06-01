import { motion } from "framer-motion";
import jsPDF from "jspdf";

export default function StepComprobante({ orden, envio }) {
  const handleDescargarPDF = () => {
    if (!orden) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.setTextColor(40, 80, 180);
    doc.text("Supermercado G5 - Comprobante de compra", 105, y, {
      align: "center",
    });

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`N° Orden: ${orden.ordenId}`, 15, y);
    doc.text(
      `Fecha: ${new Date(orden.fechaCreacion).toLocaleString("es-AR")}`,
      70,
      y
    );
    doc.text(`Estado: ${orden.estado}`, 150, y);

    y += 7;
    doc.text(`Dirección: ${orden.direccion}`, 15, y);

    y += 10;
    doc.setFontSize(12);
    doc.text("Productos:", 15, y);

    y += 7;
    doc.setFontSize(10);
    doc.text("Producto", 15, y);
    doc.text("Cant.", 80, y);
    doc.text("P. Unit.", 105, y);
    doc.text("Subtotal", 135, y);

    y += 6;
    orden.items.forEach((item) => {
      doc.text(item.nombreProducto, 15, y);
      doc.text(String(item.cantidad), 80, y);
      doc.text(`$${item.precioUnitario.toFixed(2)}`, 105, y);
      doc.text(`$${item.subtotal.toFixed(2)}`, 135, y);
      y += 6;
    });

    y += 6;
    doc.setFontSize(11);
    doc.text(`Subtotal: $${orden.subtotal.toLocaleString("es-AR")}`, 120, y);
    y += 6;
    doc.text(
      `Descuento: -$${orden.descuentoTotal.toLocaleString("es-AR")}`,
      120,
      y
    );
    y += 6;
    if (orden.direccion !== "Retiro en local") {
      doc.text("Envío: +$2000", 120, y);
      y += 6;
    }
    doc.setFontSize(14);
    doc.setTextColor(24, 160, 20);
    const totalFinal =
      orden.direccion !== "Retiro en local" ? orden.total + 2000 : orden.total;
    doc.text(`TOTAL: $${totalFinal.toLocaleString("es-AR")}`, 120, y);

    y += 14;
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("¡Gracias por tu compra!", 105, y, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Impreso: ${new Date().toLocaleString("es-AR")}`, 15, 290);

    doc.save("comprobante-compra.pdf");
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <div className="text-green-600 text-4xl mb-4">¡Pago exitoso!</div>
        <div className="mb-1 text-lg font-semibold text-gray-700">
          Tu compra fue realizada correctamente.
        </div>
        <div className="my-4 text-left max-w-xl mx-auto space-y-2">
          <div>
            <b>N° Orden:</b> {orden.ordenId}
          </div>
          <div>
            <b>Fecha:</b>{" "}
            {new Date(orden.fechaCreacion).toLocaleString("es-AR")}
          </div>
          <div>
            <b>Estado:</b> {orden.estado}
          </div>
          <div>
            <b>Dirección:</b> {orden.direccion}
          </div>
        </div>
        <div className="rounded-xl border border-blue-100 bg-gray-50 shadow-sm overflow-x-auto my-4">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="py-2 px-3">Producto</th>
                <th className="py-2 px-3">Cantidad</th>
                <th className="py-2 px-3">Precio c/u</th>
                <th className="py-2 px-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((item) => (
                <tr key={item.productoId}>
                  <td className="py-2 px-3">{item.nombreProducto}</td>
                  <td className="py-2 px-3">{item.cantidad}</td>
                  <td className="py-2 px-3">
                    ${item.precioUnitario.toFixed(2)}
                  </td>
                  <td className="py-2 px-3">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="max-w-xl mx-auto text-right text-lg space-y-1">
          <div>
            Subtotal:{" "}
            <span className="text-gray-800">
              ${orden.subtotal.toLocaleString("es-AR")}
            </span>
          </div>
          <div>
            Descuento:{" "}
            <span className="text-red-700">
              - ${orden.descuentoTotal.toLocaleString("es-AR")}
            </span>
          </div>
          {orden.direccion !== "Retiro en local" && (
            <div>
              Envío: <span className="text-blue-700">+ $2000</span>
            </div>
          )}
          <div className="mt-1 text-2xl font-bold">
            Total a pagar:{" "}
            <span className="text-green-800">
              $
              {(orden.direccion !== "Retiro en local"
                ? orden.total + 2000
                : orden.total
              ).toLocaleString("es-AR")}
            </span>
          </div>
        </div>
        <button
          className="mt-6 px-8 py-3 bg-blue-700 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-blue-800 transition"
          onClick={handleDescargarPDF}
        >
          Descargar comprobante en PDF
        </button>
      </div>
    </motion.div>
  );
}
