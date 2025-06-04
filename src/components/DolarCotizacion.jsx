import { useEffect, useState } from "react";

export default function DolarCotizacion({ compact = false }) {
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
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchDolar, 300000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-600 text-xs">{error}</div>;
  if (!cotizacion)
    return <div className="text-gray-500 text-xs">Cargando dólar...</div>;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold">DOLAR:</span>
        <span>Oficial ${cotizacion.oficial.value_sell.toFixed(2)}</span>
        <span>|</span>
        <span>Blue ${cotizacion.blue.value_sell.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div className="mb-3 flex flex-col text-sm items-start bg-green-50 px-3 py-2 rounded shadow">
      <span className="font-bold text-green-700 mb-1">Dólar hoy</span>
      <span>
        Oficial: <b>${cotizacion.oficial.value_sell.toFixed(2)}</b>
      </span>
      <span>
        Blue: <b>${cotizacion.blue.value_sell.toFixed(2)}</b>
      </span>
    </div>
  );
}
