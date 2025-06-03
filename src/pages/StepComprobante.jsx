import { useRef } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function StepComprobante({ orden, envio }) {
  const comprobanteRef = useRef();
  const pdfComprobanteRef = useRef();

  const handleDescargarPDF = async () => {
    if (!pdfComprobanteRef.current) return;

    try {
      const canvas = await html2canvas(pdfComprobanteRef.current, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: false,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("comprobante-compra.pdf");
    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "$0,00";
    return `$${price.toFixed(2).replace(".", ",")}`;
  };

  const calculatePriceWithoutTaxes = (price) => {
    if (typeof price !== "number" || isNaN(price)) return 0;
    return price / 1.21;
  };

  // Cálculos de precios
  const subtotalProductos = orden?.total || 0;
  const subtotalSinImpuestos = calculatePriceWithoutTaxes(subtotalProductos);
  const costoEnvio = envio ? 2000 : 0;
  const total = subtotalProductos + costoEnvio;

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Vista web - diseño optimizado para pantalla */}
      <div
        ref={comprobanteRef}
        className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Detalle del Pedido #{orden?.ordenId || ""}
        </h1>

        <div className="mb-6 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Fecha:</span>{" "}
            {new Date(orden?.fechaCreacion || new Date()).toLocaleDateString(
              "es-AR"
            )}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Estado:</span>{" "}
            <span className="text-green-600">
              {orden?.estado || "FINALIZADA"}
            </span>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
            Productos comprados
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio unitario
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orden?.items?.map((item) => {
                  const subtotal =
                    item.subtotal || item.precioUnitario * item.cantidad;
                  const subtotalSinImpuestos =
                    calculatePriceWithoutTaxes(subtotal);

                  return (
                    <tr key={item.productoId}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nombreProducto}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                        {item.cantidad}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                        {formatPrice(item.precioUnitario)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                        <div>{formatPrice(subtotal)}</div>
                        <div className="text-xs text-gray-400">
                          Sin impuestos: {formatPrice(subtotalSinImpuestos)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección de totales con desglose */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal productos:</span>
              <span>{formatPrice(subtotalProductos)}</span>
            </div>

            {envio && (
              <div className="flex justify-between">
                <span className="font-medium">Costo de envío:</span>
                <span>{formatPrice(costoEnvio)}</span>
              </div>
            )}

            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 text-right">
            <p>
              Precio sin impuestos nacionales:{" "}
              {formatPrice(subtotalSinImpuestos + (envio ? 0 : costoEnvio))}
            </p>
            {envio && (
              <p className="text-xs">
                *no incluye costo de envío en el cálculo de impuestos
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Forma de entrega y pago
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Método de pago:</span> Tarjeta de
              crédito
            </p>
            <p>
              <span className="font-semibold">Tipo de entrega:</span>{" "}
              {envio ? (
                <span className="text-blue-600">Envío a domicilio</span>
              ) : (
                <span className="text-blue-600">Retiro en tienda</span>
              )}
            </p>
            {envio && orden.direccion && (
              <p>
                <span className="font-semibold">Dirección de envío:</span>{" "}
                {orden.direccion}
              </p>
            )}
            {!envio && (
              <p>
                <span className="font-semibold">Sucursal:</span> Sucursal
                principal
              </p>
            )}
          </div>
          <div className="mt-8 text-center">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
              type="button"
              onClick={handleDescargarPDF}
            >
              Descargar comprobante en PDF
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor oculto solo para PDF */}
      <div
        ref={pdfComprobanteRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          minHeight: "297mm",
          fontFamily: "Arial, sans-serif",
          color: "#000000",
          lineHeight: 1.5,
          padding: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            borderBottom: "1px solid #000",
            paddingBottom: "8px",
            marginBottom: "16px",
          }}
        >
          Detalle del Pedido #{orden?.ordenId || ""}
        </h1>

        <div style={{ marginBottom: "24px" }}>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(orden?.fechaCreacion || new Date()).toLocaleDateString(
              "es-AR"
            )}
          </p>
          <p>
            <strong>Estado:</strong> {orden?.estado || "FINALIZADA"}
          </p>
        </div>

        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Productos comprados
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "24px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <th style={{ textAlign: "left", padding: "8px", width: "50%" }}>
                Producto
              </th>
              <th style={{ textAlign: "center", padding: "8px", width: "15%" }}>
                Cantidad
              </th>
              <th style={{ textAlign: "right", padding: "8px", width: "20%" }}>
                Precio unitario
              </th>
              <th style={{ textAlign: "right", padding: "8px", width: "15%" }}>
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {orden?.items?.map((item) => {
              const subtotal =
                item.subtotal || item.precioUnitario * item.cantidad;
              const subtotalSinImpuestos = calculatePriceWithoutTaxes(subtotal);

              return (
                <tr
                  key={item.productoId}
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <td style={{ padding: "8px" }}>{item.nombreProducto}</td>
                  <td style={{ textAlign: "center", padding: "8px" }}>
                    {item.cantidad}
                  </td>
                  <td style={{ textAlign: "right", padding: "8px" }}>
                    {formatPrice(item.precioUnitario)}
                  </td>
                  <td style={{ textAlign: "right", padding: "8px" }}>
                    {formatPrice(subtotal)}
                    <div style={{ fontSize: "11px", color: "#666" }}>
                      Sin impuestos: {formatPrice(subtotalSinImpuestos)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Sección de totales en PDF */}
        <div style={{ textAlign: "right", marginBottom: "24px" }}>
          <div style={{ marginBottom: "8px" }}>
            <p>
              <strong>Subtotal productos:</strong>{" "}
              {formatPrice(subtotalProductos)}
            </p>
            {envio && (
              <p>
                <strong>Costo de envío:</strong> {formatPrice(costoEnvio)}
              </p>
            )}
          </div>

          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              borderTop: "1px solid #000",
              paddingTop: "8px",
            }}
          >
            <strong>Total:</strong> {formatPrice(total)}
          </p>

          <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
            Precio sin impuestos nacionales: {formatPrice(subtotalSinImpuestos)}
            {envio && " (no incluye envío)"}
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <p>
            <strong>Tipo de entrega:</strong>{" "}
            {envio ? "Envío a domicilio" : "Retiro en tienda"}
          </p>
          {envio && orden.direccion && (
            <p>
              <strong>Dirección de envío:</strong> {orden.direccion}
            </p>
          )}
          {!envio && (
            <p>
              <strong>Sucursal:</strong> Sucursal principal
            </p>
          )}
        </div>

        <div
          style={{
            borderTop: "1px solid #000",
            paddingTop: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Forma de entrega y pago
          </h2>
          <div style={{ marginBottom: "8px" }}>
            <p>
              <strong>Método de pago:</strong> Tarjeta de crédito
            </p>
          </div>
          <div>
            <p>
              <strong>Tipo de entrega:</strong>{" "}
              {envio ? "Envío a domicilio" : "Retiro en tienda"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
