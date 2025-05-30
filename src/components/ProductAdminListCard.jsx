import { Link } from 'react-router-dom'

export default function ProductAdminListCard({
  name,
  brand,
  price,
  imagenes,
  descuento,
  onEdit,
  onDelete,
  onQuickView,
}) {
  const safeName = name || "";
  const slug = safeName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  // Si imagenes es un array de strings (urls), tomamos la primera
  const img = Array.isArray(imagenes) && imagenes.length > 0 ? imagenes[0] : null;

  return (
    <div
      className="group bg-white rounded-xl shadow hover:shadow-xl flex flex-col items-stretch transition border border-gray-100 hover:border-primary relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full"
      tabIndex={0}
    >
      <Link
        to={`/producto/${slug}`}
        className="flex flex-col items-center flex-1 px-2 pt-4 pb-2"
        tabIndex={-1}
        aria-label={`Ir a la página de ${name}`}
      >
        {img ? (
          <img
            src={img}
            alt={name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
        <div className="font-semibold text-base sm:text-lg text-dark mb-1 text-center line-clamp-2">
          {name}
        </div>
        <div className="text-xs text-muted mb-1 text-center">
          {brand}
        </div>
        <div className="text-primary font-bold text-lg sm:text-xl mb-2 text-center">
          ${price}
        </div>
        {descuento && Number(descuento) > 0 && (
          <div className="text-xs text-green-600 font-semibold mb-1 text-center">
            {descuento}% OFF
          </div>
        )}
      </Link>
      <div className="flex w-full gap-2 mt-auto px-2 pb-3">
        <button
          className="bg-yellow-500 text-white px-3 py-2 rounded font-semibold flex-1"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation()
            onEdit && onEdit()
          }}
        >
          Modificar
        </button>
        <button
          className="bg-red-600 text-white px-3 py-2 rounded font-semibold flex-1"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation()
            onDelete && onDelete()
          }}
        >
          Eliminar
        </button>
        {onQuickView && (
          <button
            className="bg-gray-100 hover:bg-accent/60 text-primary px-3 py-2 rounded transition font-semibold"
            tabIndex={-1}
            title="Vista rápida"
            onClick={e => {
              e.stopPropagation()
              onQuickView({ name, brand, img, price, descuento })
            }}
          >
            <span className="sr-only">Vista rápida</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
