import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "../auth/AuthProvider";

export default function PedidoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, usuario } = useAuth();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // Llama al endpoint correcto: /ordenes/{usuarioId}/usuarios/{pedidoId}
    if (!usuario || !usuario.id) {
      setError("No se pudo obtener el usuario.");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:4040/ordenes/${id}/usuarios/${usuario.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el pedido.");
        return res.json();
      })
      .then((data) => setPedido(data))
      .catch((err) => setError(err.message || "Error al cargar el pedido."))
      .finally(() => setLoading(false));
  }, [id, token, usuario]);

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pedido-detalle-pdf");
    if (!input) return;
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Clonar el nodo y limpiar estilos problemáticos para html2canvas
    const clone = input.cloneNode(true);

    // Elimina todos los estilos de color que usen "oklch" y clases de Tailwind que puedan usar oklch
    const cleanColors = (node) => {
      if (node.nodeType === 1) {
        // Limpia atributos style con oklch y cualquier color:* o background-color:* con oklch
        const style = node.getAttribute("style");
        if (style && style.includes("oklch")) {
          node.setAttribute(
            "style",
            style.replace(/(color|background-color):\s*oklch\([^)]+\);?/g, "")
          );
        }
        // Limpia clases de Tailwind que puedan usar oklch (ej: text-primary, text-accent, bg-accent, etc)
        const classList = node.getAttribute("class");
        if (classList) {
          node.setAttribute(
            "class",
            classList
              .split(" ")
              .filter(
                (cls) =>
                  !cls.startsWith("text-primary") &&
                  !cls.startsWith("text-accent") &&
                  !cls.startsWith("bg-primary") &&
                  !cls.startsWith("bg-accent")
              )
              .join(" ")
          );
        }
        // Limpia atributos de color problemáticos
        if (node.hasAttribute("color") && node.getAttribute("color").includes("oklch")) {
          node.removeAttribute("color");
        }
        Array.from(node.children).forEach(cleanColors);
      }
    };
    cleanColors(clone);

    // También limpia todos los estilos inline de <style> que tengan oklch
    Array.from(clone.querySelectorAll("style")).forEach((styleTag) => {
      if (styleTag.innerHTML.includes("oklch")) {
        styleTag.innerHTML = styleTag.innerHTML.replace(/oklch\([^)]+\)/g, "#000");
      }
    });

    // Crear un contenedor temporal fuera de pantalla
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.background = "#fff";
    tempDiv.style.zIndex = "-1";
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);

    html2canvas(clone, { scale: 2, useCORS: true, backgroundColor: "#fff" }).then((canvas) => {
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

      if (pdfHeight <= pageHeight - 40) {
        pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
      } else {
        let position = 20;
        let renderedHeight = 0;
        while (renderedHeight < pdfHeight) {
          const sourceY = (renderedHeight * imgProps.height) / pdfHeight;
          const sourceHeight = Math.min(
            ((pageHeight - 40) * imgProps.height) / pdfHeight,
            imgProps.height - sourceY
          );
          pdf.addImage(
            imgData,
            "PNG",
            20,
            20,
            pdfWidth,
            Math.min(pdfHeight - renderedHeight, pageHeight - 40),
            undefined,
            "FAST",
            0,
            sourceY,
            imgProps.width,
            sourceHeight
          );
          renderedHeight += pageHeight - 40;
          if (renderedHeight < pdfHeight) {
            pdf.addPage();
          }
        }
      }
      pdf.save(`pedido_${id}.pdf`);
      document.body.removeChild(tempDiv);
    });
  };

  if (loading)
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">Cargando pedido...</h2>
      </div>
    );

  if (error || !pedido) {
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

  // Normaliza campos para mostrar
  const productos = pedido.items || pedido.productos || [];
  const fecha = pedido.fechaCreacion
    ? new Date(pedido.fechaCreacion).toLocaleDateString("es-AR")
    : pedido.fecha;
  const total = typeof pedido.total === "number" && !isNaN(pedido.total)
    ? pedido.total.toLocaleString("es-AR")
    : pedido.total;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">
          Detalle del Pedido #{pedido.ordenId || pedido.id}
        </h1>
        <button
          onClick={handleDownloadPDF}
          className="bg-accent hover:bg-primary text-dark hover:text-white px-4 py-2 rounded font-semibold text-sm shadow transition"
        >
          Descargar PDF
        </button>
      </div>
      <div id="pedido-detalle-pdf">
        <div className="mb-4 text-sm text-muted">
          Fecha: {fecha} <br />
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
              {productos.map((prod, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-1">{prod.nombreProducto || prod.nombre}</td>
                  <td className="py-1">{prod.cantidad}</td>
                  <td className="py-1">
                    ${prod.precioUnitario !== undefined
                      ? Number(prod.precioUnitario).toFixed(2)
                      : prod.precio !== undefined
                      ? Number(prod.precio).toFixed(2)
                      : "-"}
                  </td>
                  <td className="py-1">
                    ${prod.subtotal !== undefined
                      ? Number(prod.subtotal).toFixed(2)
                      : (prod.precioUnitario !== undefined && prod.cantidad !== undefined
                        ? (Number(prod.precioUnitario) * Number(prod.cantidad)).toFixed(2)
                        : (prod.precio !== undefined && prod.cantidad !== undefined
                          ? (Number(prod.precio) * Number(prod.cantidad)).toFixed(2)
                          : "-"))}
                    <div className="text-xs text-gray-400">
                      Precio sin impuestos nacionales: $
                      {prod.subtotal !== undefined
                        ? Math.round(Number(prod.subtotal) / 1.21)
                        : (prod.precioUnitario !== undefined && prod.cantidad !== undefined
                          ? Math.round((Number(prod.precioUnitario) * Number(prod.cantidad)) / 1.21)
                          : (prod.precio !== undefined && prod.cantidad !== undefined
                            ? Math.round((Number(prod.precio) * Number(prod.cantidad)) / 1.21)
                            : "-"))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg text-primary">
            Total: ${total}
          </div>
          <div className="text-right text-xs text-gray-400 mb-2">
            Precio sin impuestos nacionales: $
            {pedido.total
              ? Math.round(Number(pedido.total) / 1.21)
              : "-"}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-dark">Forma de entrega y pago</h2>
          <div className="text-sm text-muted mb-1">
            Método de pago: <span className="font-semibold">{pedido.metodoPago}</span>
          </div>
          <div className="text-sm text-muted mb-1">
            Tipo de entrega: <span className="font-semibold">
              {pedido.direccion && pedido.direccion !== "Retiro en local"
                ? "Envío a domicilio"
                : "Retiro en tienda"}
            </span>
          </div>
          {pedido.direccion && pedido.direccion !== "Retiro en local" && (
            <div className="text-sm text-muted mb-1">
              Dirección de entrega: <span className="font-semibold">{pedido.direccion}</span>
            </div>
          )}
          {pedido.direccion === "Retiro en local" && (
            <div className="text-sm text-muted mb-1">
              Sucursal: <span className="font-semibold">Sucursal principal</span>
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
