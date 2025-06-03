import { useEffect, useState } from "react";

export default function DolarCotizacion() {
  const [cotizacion, setCotizacion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDolar() {
      try {
        const res = await fetch("https://api.bluelytics.com.ar/v2/latest");
        if (!res.ok) throw new Error("Error al consultar cotización");
        const data = await res.json();
        setCotizacion(data);
      } catch (err) {
        setError("No se pudo obtener la cotización");
      }
    }
    fetchDolar();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!cotizacion)
    return <div className="text-gray-500">Cargando dólar...</div>;

  return (
    <div className="mb-3 flex flex-col text-sm items-start bg-green-50 px-3 py-2 rounded shadow">
      <span className="font-bold text-green-700 mb-1">Dólar hoy</span>
      <span>
        Oficial: <b>${cotizacion.oficial.value_sell}</b>
      </span>
      <span>
        Blue: <b>${cotizacion.blue.value_sell}</b>
      </span>
    </div>
  );
}
