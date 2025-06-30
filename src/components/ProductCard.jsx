import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../auth/AuthProvider'
import { useSelector } from "react-redux";

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
  onAddToCart,
  added: addedProp,
  units: unitsProp,
}) {
  const token = useSelector((state) => state.auth.token);
  const usuario = useSelector((state) => state.auth.usuario);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  const [units, setUnits] = useState(unitsProp || 0)
  const [loading, setLoading] = useState(false)
  const [showQty, setShowQty] = useState(unitsProp > 0)
  // Sincroniza unidades si viene de props (para animación global)
  useEffect(() => {
    if (typeof unitsProp === "number") setUnits(unitsProp)
    setShowQty(unitsProp > 0)
  }, [unitsProp])

  const handleAdd = async (e) => {
    e.stopPropagation()
    if (!onAddToCart || !id || !token) return
    setLoading(true)
    await onAddToCart(id, 1)
    setUnits(units + 1)
    setShowQty(true)
    setLoading(false)
  }

  const handlePlus = async (e) => {
    e.stopPropagation()
    if (!onAddToCart || !id || !token) return
    setLoading(true)
    await onAddToCart(id, 1)
    setUnits(units + 1)
    setLoading(false)
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Mostrar modal o redirigir a login
      // ...
      return;
    }
    // Usar token para agregar al carrito
    dispatch(addToCartThunk({ token, productoId, cantidad }));
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl flex flex-col items-stretch transition border border-gray-100 hover:border-primary relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full overflow-visible mx-auto"
      tabIndex={0}
      style={{
        margin: "0 8px 20px 8px",
        background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
        flex: "1 1 240px",
        minWidth: 210,
        maxWidth: 270,
        minHeight: 0,
        height: "auto",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {offer && (
        <span className="absolute top-3 left-3 bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full shadow z-10">
          {offer}
        </span>
      )}
      {bestSeller && (
        <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow z-10">
          Más vendido
        </span>
      )}
      <Link
        to={id ? `/producto/id/${id}` : `/producto/${slug}`}
        className="flex flex-col items-center flex-1 px-4 pt-6 pb-2 w-full"
        tabIndex={-1}
        aria-label={`Ir a la página de ${name}`}
        style={{
          width: "100%",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div className="relative w-full flex items-center justify-center mb-2">
          <img
            src={img}
            alt={name}
            className="object-cover rounded-xl shadow-md group-hover:scale-105 transition w-32 h-32 bg-gray-100 border border-gray-200"
            style={{
              minWidth: 128,
              minHeight: 128,
              maxWidth: 128,
              maxHeight: 128,
              background: "#f3f4f6",
              objectFit: "cover",
              display: "block",
              margin: "0 auto"
            }}
          />
        </div>
        <div
          className="font-semibold text-base sm:text-lg text-dark mb-1 text-center line-clamp-2"
          style={{
            minHeight: 40,
            maxHeight: 48,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            width: "100%",
          }}
        >
          {name}
        </div>
        <div className="text-xs text-muted mb-1 text-center w-full truncate">
          {brand} {weight && `· ${weight}`}
        </div>
        <div className="text-primary font-bold text-xl mb-1 text-center w-full">
          ${price}
        </div>
        {showSinImpuestos && (
          <div className="text-xs text-gray-400 text-center mb-2 w-full">
            Precio sin impuestos nacionales: ${Math.round(price / 1.21)}
          </div>
        )}
      </Link>
      <div className="flex w-full gap-2 mt-auto px-4 pb-4 relative min-h-[40px]">
        {!showQty ? (
          <button
            className={`bg-primary text-white px-4 py-2 rounded-lg text-base transition font-semibold flex-1 relative
              hover:bg-secondary ${loading || !token ? "opacity-70 cursor-not-allowed" : ""}
            `}
            tabIndex={-1}
            onClick={handleAdd}
            disabled={loading || !token}
            title={!token ? "Debés iniciar sesión para agregar al carrito" : undefined}
            style={{
              boxShadow: "0 2px 8px 0 rgba(37,99,235,0.08)",
              letterSpacing: "0.01em",
            }}
          >
            {loading ? "Agregando..." : "Agregar"}
          </button>
        ) : (
          <div className="flex items-center justify-center w-full gap-2">
            <span className="bg-blue-100 text-blue-700 text-base font-bold rounded-full px-3 py-1 select-none">
              {units}
            </span>
            <button
              className={`bg-primary text-white px-4 py-2 rounded-lg text-base transition font-semibold flex items-center justify-center
                hover:bg-secondary ${loading || !token ? "opacity-70 cursor-not-allowed" : ""}
              `}
              tabIndex={-1}
              onClick={handlePlus}
              disabled={loading || !token}
              aria-label="Agregar uno más"
              title={!token ? "Debés iniciar sesión para agregar al carrito" : undefined}
              style={{
                boxShadow: "0 2px 8px 0 rgba(37,99,235,0.08)",
              }}
            >
              <span className="text-lg font-bold">+</span>
            </button>
          </div>
        )}
        {onQuickView && (
          <button
            className="bg-gray-100 hover:bg-accent/60 text-primary px-4 py-2 rounded-lg transition font-semibold"
            tabIndex={-1}
            title="Vista rápida"
            onClick={e => {
              e.stopPropagation()
              onQuickView({ id, name, brand, img, price, weight, offer, bestSeller })
            }}
            style={{
              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)",
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
