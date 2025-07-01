import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSelector, useDispatch } from "react-redux";
import { fetchPedidoPorId } from "../redux/ordenesSlice";

export default function PedidoDetallePage() {
  const pedido = useSelector((state) => state.ordenes.pedido);
  const loading = useSelector((state) => state.ordenes.loading);
  const error = useSelector((state) => state.ordenes.error);
  const usuario = useSelector((state) => state.auth.usuario);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !usuario.id) return;
    dispatch(fetchPedidoPorId({ token, usuarioId: usuario.id, pedidoId: id }));
  }, [id, token, usuario, dispatch]);

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pedido-detalle-pdf");
    if (!input) return;
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const clone = input.cloneNode(true);

    // Limpia clases problemáticas de Tailwind (opcional, si te da problemas el PDF)
    const cleanStyles = (node) => {
      if (node.nodeType === 1) {
        if (node.hasAttribute("style")) {
          const style = node.getAttribute("style");
          if (style && style.includes("oklch")) {
            node.setAttribute(
              "style",
              style.replace(/oklch\([^)]+\)/g, "rgb(0, 0, 0)")
            );
          }
        }
        if (node.hasAttribute("class")) {
          const classes = node.getAttribute("class").split(" ");
          const filtered = classes.filter(
            (cls) =>
              !cls.startsWith("text-") &&
              !cls.startsWith("bg-") &&
              !cls.startsWith("border-") &&
              !cls.includes("primary") &&
              !cls.includes("accent") &&
              !cls.includes("secondary")
          );
          node.setAttribute("class", filtered.join(" "));
        }
        if (node.hasAttribute("color")) {
          node.removeAttribute("color");
        }
        Array.from(node.children).forEach(cleanStyles);
      }
    };
    cleanStyles(clone);

    Array.from(clone.querySelectorAll("style")).forEach((styleTag) => {
      styleTag.innerHTML = styleTag.innerHTML
        .replace(/oklch\([^)]+\)/g, "rgb(0, 0, 0)")
        .replace(/color:[^;]+;/g, "color: #000;")
        .replace(/background-color:[^;]+;/g, "background-color: #fff;");
    });

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.background = "#fff";
    tempDiv.style.zIndex = "-1";
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);

    const options = {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      ignoreElements: (element) => false,
    };

    try {
      const canvas = await html2canvas(clone, options);
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
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert(
        "Ocurrió un error al generar el PDF. Por favor intenta nuevamente."
      );
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  if (loading)
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Cargando pedido...
        </h2>
      </div>
    );

  if (error || !pedido) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Pedido no encontrado
        </h2>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </button>
      </div>
    );
  }

  const productos = pedido.items || pedido.productos || [];
  const fecha = pedido.fechaCreacion
    ? new Date(pedido.fechaCreacion).toLocaleDateString("es-AR")
    : pedido.fecha;
  const total =
    typeof pedido.total === "number" && !isNaN(pedido.total)
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
          <h2 className="text-lg font-semibold mb-2 text-dark">
            Productos comprados
          </h2>
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
                    $
                    {prod.precioUnitario !== undefined
                      ? Number(prod.precioUnitario).toFixed(2)
                      : prod.precio !== undefined
                      ? Number(prod.precio).toFixed(2)
                      : "-"}
                  </td>
                  <td className="py-1">
                    $
                    {prod.subtotal !== undefined
                      ? Number(prod.subtotal).toFixed(2)
                      : prod.precioUnitario !== undefined &&
                        prod.cantidad !== undefined
                      ? (
                          Number(prod.precioUnitario) * Number(prod.cantidad)
                        ).toFixed(2)
                      : prod.precio !== undefined && prod.cantidad !== undefined
                      ? (Number(prod.precio) * Number(prod.cantidad)).toFixed(2)
                      : "-"}
                    <div className="text-xs text-gray-400">
                      Precio sin impuestos nacionales: $
                      {prod.subtotal !== undefined
                        ? Math.round(Number(prod.subtotal) / 1.21)
                        : prod.precioUnitario !== undefined &&
                          prod.cantidad !== undefined
                        ? Math.round(
                            (Number(prod.precioUnitario) *
                              Number(prod.cantidad)) /
                              1.21
                          )
                        : prod.precio !== undefined &&
                          prod.cantidad !== undefined
                        ? Math.round(
                            (Number(prod.precio) * Number(prod.cantidad)) / 1.21
                          )
                        : "-"}
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
            {pedido.total ? Math.round(Number(pedido.total) / 1.21) : "-"}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-dark">
            Forma de entrega y pago
          </h2>
          <div className="text-sm text-muted mb-1">
            Método de pago:{" "}
            <span className="font-semibold">{pedido.metodoPago}</span>
          </div>
          <div className="text-sm text-muted mb-1">
            Tipo de entrega:{" "}
            <span className="font-semibold">
              {pedido.direccion && pedido.direccion !== "Retiro en local"
                ? "Envío a domicilio"
                : "Retiro en tienda"}
            </span>
          </div>
          {pedido.direccion && pedido.direccion !== "Retiro en local" && (
            <div className="text-sm text-muted mb-1">
              Dirección de entrega:{" "}
              <span className="font-semibold">{pedido.direccion}</span>
            </div>
          )}
          {pedido.direccion === "Retiro en local" && (
            <div className="text-sm text-muted mb-1">
              Sucursal:{" "}
              <span className="font-semibold">Sucursal principal</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Link
          to="/mis-pedidos"
          className="text-primary hover:underline text-sm"
        >
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
