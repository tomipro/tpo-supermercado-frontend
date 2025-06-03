// Función para dar formato a la fecha

function formatearFecha(fechaIso) {
  if (!fechaIso) return "";
  const fecha = new Date(fechaIso);
  return fecha.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
export default formatearFecha;
