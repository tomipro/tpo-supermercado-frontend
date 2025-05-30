import { useParams, Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Simulación de pedidos (debería venir de backend)
const pedidos = [
  {
    id: "PED123",
    fecha: "2024-06-01",
    total: 12500,
    estado: "Entregado",
    metodoPago: "Tarjeta de crédito",
    tipoEntrega: "Envío a domicilio",
    direccion: "Av. Siempre Viva 123, CABA",
    productos: [
      { nombre: "Leche Entera", cantidad: 2, precio: 800 },
      { nombre: "Pan Integral", cantidad: 1, precio: 650 },
    ],
  },
  {
    id: "PED124",
    fecha: "2024-05-20",
    total: 3200,
    estado: "Retirado",
    metodoPago: "Mercado Pago",
    tipoEntrega: "Retiro en tienda",
    sucursal: "Sucursal Palermo",
    productos: [
      { nombre: "Manzana Roja", cantidad: 3, precio: 500 },
      { nombre: "Bife de Chorizo", cantidad: 1, precio: 2500 },
    ],
  },
];

export default function PedidoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pedido = pedidos.find((p) => p.id === id);

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pedido-detalle-pdf");
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
    pdf.save(`pedido_${pedido.id}.pdf`);
  };

  if (!pedido) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Pedido no encontrado</h2>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Detalle del Pedido #{pedido.id}</h1>
        <button
          onClick={handleDownloadPDF}
          className="bg-accent hover:bg-primary text-dark hover:text-white px-4 py-2 rounded font-semibold text-sm shadow transition"
        >
          Descargar PDF
        </button>
      </div>
      <div id="pedido-detalle-pdf">
        <div className="mb-4 text-sm text-muted">
          Fecha: {pedido.fecha} <br />
          Estado: <span className="font-semibold">{pedido.estado}</span>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-dark">Productos comprados</h2>
          <table className="w-full text-sm mb-2">
            <thead>
              <tr className="text-left text-muted border-b">
                <th className="py-1">Producto</th>
                <th className="py-1">Cantidad</th>
                <th className="py-1">Precio unitario</th>
                <th className="py-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.productos.map((prod, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-1">{prod.nombre}</td>
                  <td className="py-1">{prod.cantidad}</td>
                  <td className="py-1">${prod.precio}</td>
                  <td className="py-1">
                    ${prod.precio * prod.cantidad}
                    <div className="text-xs text-gray-400">
                      Precio sin impuestos nacionales: ${Math.round((prod.precio * prod.cantidad) / 1.21)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg text-primary">
            Total: ${pedido.total}
          </div>
          <div className="text-right text-xs text-gray-400 mb-2">
            Precio sin impuestos nacionales: ${Math.round(pedido.total / 1.21)}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-dark">Forma de entrega y pago</h2>
          <div className="text-sm text-muted mb-1">
            Método de pago: <span className="font-semibold">{pedido.metodoPago}</span>
          </div>
          <div className="text-sm text-muted mb-1">
            Tipo de entrega: <span className="font-semibold">{pedido.tipoEntrega}</span>
          </div>
          {pedido.tipoEntrega === "Envío a domicilio" && (
            <div className="text-sm text-muted mb-1">
              Dirección de entrega: <span className="font-semibold">{pedido.direccion}</span>
            </div>
          )}
          {pedido.tipoEntrega === "Retiro en tienda" && (
            <div className="text-sm text-muted mb-1">
              Sucursal: <span className="font-semibold">{pedido.sucursal}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Link to="/mis-pedidos" className="text-primary hover:underline text-sm">
          ← Volver a mis pedidos
        </Link>
        <button
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded font-semibold text-sm shadow transition"
          onClick={() => navigate("/")}
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
