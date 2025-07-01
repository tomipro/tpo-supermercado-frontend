import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdenesUsuario } from "../redux/ordenesSlice";

export default function MisPedidosPage() {
  const token = useSelector((state) => state.auth.token);
  const usuario = useSelector((state) => state.auth.usuario);
  const pedidos = useSelector((state) => state.ordenes.pedidos);
  const loading = useSelector((state) => state.ordenes.loading);
  const error = useSelector((state) => state.ordenes.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && usuario && usuario.id) {
      dispatch(fetchOrdenesUsuario({ token, usuarioId: usuario.id }));
    }
  }, [token, usuario?.id, dispatch]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-primary">Mis Pedidos</h1>
      {loading ? (
        <div className="text-gray-500">Cargando pedidos...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : pedidos.length === 0 ? (
        <div className="text-gray-500">No tenés pedidos realizados.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {pedidos.map((pedido) => (
            <Link
              to={`/mis-pedidos/${pedido.ordenId || pedido.id}`}
              key={pedido.ordenId || pedido.id}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 hover:border-primary p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center transition"
            >
              <div>
                <div className="font-semibold text-lg text-dark mb-1">
                  Pedido #{pedido.ordenId || pedido.id}
                </div>
                <div className="text-sm text-muted mb-1">
                  Fecha:{" "}
                  {pedido.fechaCreacion
                    ? new Date(pedido.fechaCreacion).toLocaleDateString("es-AR")
                    : pedido.fecha}
                </div>
                <div className="text-sm text-muted mb-1">
                  Estado: <span className="font-semibold">{pedido.estado}</span>
                </div>
                <div className="text-sm text-muted">
                  Total:{" "}
                  <span className="font-bold text-primary">
                    $
                    {typeof pedido.total === "number" && !isNaN(pedido.total)
                      ? pedido.total.toLocaleString("es-AR")
                      : pedido.total}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Precio sin impuestos nacionales: $
                  {pedido.total ? Math.round(Number(pedido.total) / 1.21) : "-"}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
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
