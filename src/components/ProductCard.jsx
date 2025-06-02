import { Link } from 'react-router-dom'

export default function ProductCard({
  id,
  name,
  brand,
  img,
  price,
  weight,
  offer,
  bestSeller,
  onQuickView,
  showSinImpuestos = true,
  onAddToCart, // NUEVO
}) {
  // Esta línea genera un "slug" a partir del nombre del producto.
  // El slug es una versión del nombre en minúsculas, sin espacios ni caracteres especiales,
  // ideal para usar en URLs amigables (por ejemplo: "Leche Entera" -> "leche-entera").
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <div
      className="group bg-white rounded-xl shadow hover:shadow-xl flex flex-col items-stretch transition border border-gray-100 hover:border-primary relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full"
      tabIndex={0}
    >
      {offer && (
        <span className="absolute top-2 left-2 bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full shadow">
          {offer}
        </span>
      )}
      {bestSeller && (
        <span className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          Más vendido
        </span>
      )}
      <Link
        to={id ? `/producto/id/${id}` : `/producto/${slug}`}
        className="flex flex-col items-center flex-1 px-2 pt-4 pb-2"
        tabIndex={-1}
        aria-label={`Ir a la página de ${name}`}
      >
        <img
          src={img}
          alt={name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition"
        />
        <div className="font-semibold text-base sm:text-lg text-dark mb-1 text-center line-clamp-2">
          {name}
        </div>
        <div className="text-xs text-muted mb-1 text-center">
          {brand} {weight && `· ${weight}`}
        </div>
        <div className="text-primary font-bold text-lg sm:text-xl mb-1 text-center">
          ${price}
        </div>
        {showSinImpuestos && (
          <div className="text-xs text-gray-400 text-center mb-2">
            Precio sin impuestos nacionales: ${Math.round(price / 1.21)}
          </div>
        )}
      </Link>
      <div className="flex w-full gap-2 mt-auto px-2 pb-3">
        <button
          className="bg-primary text-white px-3 py-2 rounded hover:bg-secondary text-sm sm:text-base transition font-semibold flex-1"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation()
            if (onAddToCart && id) onAddToCart(id, 1)
          }}
        >
          Agregar
        </button>
        {onQuickView && (
          <button
            className="bg-gray-100 hover:bg-accent/60 text-primary px-3 py-2 rounded transition font-semibold"
            tabIndex={-1}
            title="Vista rápida"
            onClick={e => {
              e.stopPropagation()
              onQuickView({ name, brand, img, price, weight, offer, bestSeller })
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
