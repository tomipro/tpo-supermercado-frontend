import { Link } from "react-router-dom";

// Simulación de pedidos
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

export default function MisPedidosPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-primary">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <div className="text-gray-500">No tenés pedidos realizados.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {pedidos.map((pedido) => (
            <Link
              to={`/mis-pedidos/${pedido.id}`}
              key={pedido.id}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 hover:border-primary p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center transition"
            >
              <div>
                <div className="font-semibold text-lg text-dark mb-1">
                  Pedido #{pedido.id}
                </div>
                <div className="text-sm text-muted mb-1">
                  Fecha: {pedido.fecha}
                </div>
                <div className="text-sm text-muted mb-1">
                  Estado: <span className="font-semibold">{pedido.estado}</span>
                </div>
                <div className="text-sm text-muted">
                  Total: <span className="font-bold text-primary">${pedido.total}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Precio sin impuestos nacionales: ${Math.round(pedido.total / 1.21)}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
                <span className="text-xs text-gray-400">
                  {pedido.tipoEntrega === "Envío a domicilio"
                    ? `A domicilio`
                    : `Retiro en tienda`}
                </span>
                <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded font-semibold text-sm shadow transition">
                  Ver detalles
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
