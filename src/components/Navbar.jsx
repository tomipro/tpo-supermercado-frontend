import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../context/CartContext";

// Componente mejorado para mostrar la cotización del dólar
function DolarCotizacion() {
  const [cotizaciones, setCotizaciones] = useState({
    oficial: { compra: 0, venta: 0, variacion: 0 },
    blue: { compra: 0, venta: 0, variacion: 0 },
    lastUpdated: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    // Simulación de datos de API
    const fetchCotizaciones = () => {
      // Datos simulados
      const mockData = {
        oficial: {
          compra: 350.5,
          venta: 370.25,
          variacion: 1.2, // Porcentaje
        },
        blue: {
          compra: 480.75,
          venta: 500.3,
          variacion: -0.8, // Porcentaje
        },
        lastUpdated: new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setCotizaciones(mockData);
    };

    fetchCotizaciones();
    // Actualizar cada minuto (60000 ms)
    const interval = setInterval(fetchCotizaciones, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatVariacion = (value) => {
    const isPositive = value >= 0;
    return (
      <span
        className={`flex items-center ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="flex items-center justify-center gap-4 text-xs sm:text-sm">
      <div className="flex items-center gap-1">
        <span className="font-semibold">Dólar Oficial:</span>
        <span className="text-gray-700">
          ${cotizaciones.oficial.compra.toFixed(2)}
        </span>
        <span>/</span>
        <span className="text-gray-700">
          ${cotizaciones.oficial.venta.toFixed(2)}
        </span>
        {formatVariacion(cotizaciones.oficial.variacion)}
      </div>
      <div className="h-4 w-px bg-gray-300"></div>
      <div className="flex items-center gap-1">
        <span className="font-semibold">Dólar Blue:</span>
        <span className="text-gray-700">
          ${cotizaciones.blue.compra.toFixed(2)}
        </span>
        <span>/</span>
        <span className="text-gray-700">
          ${cotizaciones.blue.venta.toFixed(2)}
        </span>
        {formatVariacion(cotizaciones.blue.variacion)}
      </div>
      <div className="hidden sm:block text-gray-500 text-xs">
        Actualizado: {cotizaciones.lastUpdated}
      </div>
    </div>
  );
}

const categoriesDropdown = [
  { name: "Ver todos", to: "/categorias" },
  { name: "Verdulería", to: "/categorias?cat=verduleria" },
  { name: "Carnes", to: "/categorias?cat=carnes" },
  { name: "Lácteos", to: "/categorias?cat=lacteos" },
  { name: "Panadería", to: "/categorias?cat=panaderia" },
  { name: "Snacks", to: "/categorias?cat=snacks" },
  { name: "Bebidas", to: "/categorias?cat=bebidas" },
  { name: "Limpieza", to: "/categorias?cat=limpieza" },
  { name: "Cuidado personal", to: "/categorias?cat=cuidado-personal" },
];

const promosDropdown = [
  { name: "Ver todos", to: "/promociones" },
  { name: "2x1 en Gaseosas", to: "/promociones?promo=gaseosas" },
  {
    name: "20% OFF en Frutas y Verduras",
    to: "/promociones?promo=frutas-verduras",
  },
  { name: "Envío gratis", to: "/promociones?promo=envio-gratis" },
];

const navLinks = [
  { label: "Categorías", dropdown: categoriesDropdown },
  { label: "Promociones", dropdown: promosDropdown },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const { usuario, isAuthenticated, logout } = useAuth();
  const { carrito, loading } = useCart();
  const navigate = useNavigate();
  const totalItems = carrito?.items?.reduce(
    (sum, item) => sum + (item.cantidad || 0),
    0
  );

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/buscar?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowMobileSearch(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdown(false);
      }
    }
    if (userDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdown]);

  return (
    <>
      <div className="w-full bg-green-50 py-2 px-4 border-b border-green-200">
        <div className="max-w-[1600px] mx-auto">
          <DolarCotizacion />
        </div>
      </div>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100">
        <nav className="max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-8 h-[76px] gap-2">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-primary hover:opacity-90 transition-opacity select-none"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg text-white text-3xl">
              🛒
            </span>
            <span
              className="hidden sm:inline font-black text-dark tracking-tight text-2xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Supermercado G4
            </span>
          </Link>

          {/* SearchBar Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 mx-6 max-w-xl"
          >
            <input
              type="text"
              placeholder="Buscar productos, marcas, categorías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l-md border border-gray-200 focus:ring-2 focus:ring-primary text-gray-900 text-base outline-none bg-white"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white font-semibold px-5 py-2 rounded-r-md transition"
            >
              Buscar
            </button>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdown(link.label)}
                onMouseLeave={() => setDropdown(null)}
                onFocus={() => setDropdown(link.label)}
                onBlur={() => setDropdown(null)}
                tabIndex={0}
              >
                <button
                  className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 text-base flex items-center gap-1 ${
                    dropdown === link.label
                      ? "bg-primary text-white shadow-md"
                      : "text-dark hover:bg-accent/70 hover:text-primary"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                  aria-haspopup="true"
                  aria-expanded={dropdown === link.label}
                  type="button"
                >
                  {link.label}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Dropdown */}
                {dropdown === link.label && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="block px-4 py-2 text-dark hover:bg-accent/40 hover:text-primary rounded transition"
                        tabIndex={0}
                        onClick={() => setDropdown(null)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <NavLink
              to="/buscar"
              className="px-5 py-2 rounded-full font-semibold transition-all duration-200 text-base text-dark hover:bg-accent/70 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Todos los productos
            </NavLink>
          </div>

          {/* User Actions + Mobile Search */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Icon */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-accent/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setShowMobileSearch(true)}
              aria-label="Buscar"
            >
              <svg
                className="w-7 h-7 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="relative group">
              <button
                className="relative"
                onClick={() => navigate("/carrito")}
                aria-label="Ver carrito"
              >
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="9" cy="21" r="1.5" />
                  <circle cx="18" cy="21" r="1.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 4h13"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {totalItems}
                  </span>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="p-4">
                  <div className="font-bold mb-2 text-primary">Carrito</div>
                  {loading ? (
                    <div className="text-gray-400 text-sm">Cargando...</div>
                  ) : carrito?.items?.length === 0 ? (
                    <div className="text-gray-400 text-sm">
                      Tu carrito está vacío.
                    </div>
                  ) : (
                    <>
                      <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                        {carrito.items.slice(0, 5).map((item) => (
                          <li
                            key={item.productoId}
                            className="py-2 flex items-center gap-2"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-sm">
                                {item.nombreProducto}
                              </div>
                              <div className="text-xs text-gray-500">
                                x{item.cantidad}
                              </div>
                              <div className="text-xs text-gray-700">
                                {item.precioUnitario !== undefined &&
                                item.precioUnitario !== null
                                  ? `Precio: $${Number(
                                      item.precioUnitario
                                    ).toFixed(2)}`
                                  : ""}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {item.precioUnitario !== undefined &&
                                item.precioUnitario !== null
                                  ? `Sin IVA: $${Math.round(
                                      Number(item.precioUnitario) / 1.21
                                    )}`
                                  : ""}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-primary text-right min-w-[60px]">
                              {item.subtotal !== undefined &&
                              item.subtotal !== null
                                ? `$${Number(item.subtotal).toFixed(2)}`
                                : item.precioUnitario !== undefined &&
                                  item.cantidad !== undefined
                                ? `$${(
                                    Number(item.precioUnitario) *
                                    Number(item.cantidad)
                                  ).toFixed(2)}`
                                : "-"}
                              <div className="text-[10px] text-gray-400 font-normal">
                                {item.precioUnitario !== undefined &&
                                item.cantidad !== undefined
                                  ? `Sin IVA: $${Math.round(
                                      (Number(item.precioUnitario) *
                                        Number(item.cantidad)) /
                                        1.21
                                    )}`
                                  : ""}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex flex-col gap-1 border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">
                            Total:
                          </span>
                          <span className="font-bold text-lg text-green-700">
                            {carrito.total !== undefined &&
                            carrito.total !== null &&
                            !isNaN(Number(carrito.total))
                              ? `$${Number(carrito.total).toFixed(2)}`
                              : (() => {
                                  const total = carrito.items.reduce(
                                    (sum, item) => {
                                      if (
                                        item.subtotal !== undefined &&
                                        item.subtotal !== null &&
                                        !isNaN(Number(item.subtotal))
                                      ) {
                                        return sum + Number(item.subtotal);
                                      }
                                      if (
                                        item.precioUnitario !== undefined &&
                                        item.cantidad !== undefined
                                      ) {
                                        return (
                                          sum +
                                          Number(item.precioUnitario) *
                                            Number(item.cantidad)
                                        );
                                      }
                                      return sum;
                                    },
                                    0
                                  );
                                  return `$${total.toFixed(2)}`;
                                })()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] text-gray-500">
                          <span>Sin IVA (21%):</span>
                          <span>
                            {(() => {
                              let total = 0;
                              if (
                                carrito.total !== undefined &&
                                carrito.total !== null &&
                                !isNaN(Number(carrito.total))
                              ) {
                                total = Number(carrito.total);
                              } else {
                                total = carrito.items.reduce((sum, item) => {
                                  if (
                                    item.subtotal !== undefined &&
                                    item.subtotal !== null &&
                                    !isNaN(Number(item.subtotal))
                                  ) {
                                    return sum + Number(item.subtotal);
                                  }
                                  if (
                                    item.precioUnitario !== undefined &&
                                    item.cantidad !== undefined
                                  ) {
                                    return (
                                      sum +
                                      Number(item.precioUnitario) *
                                        Number(item.cantidad)
                                    );
                                  }
                                  return sum;
                                }, 0);
                              }
                              return `$${Math.round(total / 1.21)}`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="mt-3 text-right">
                    <Link
                      to="/carrito"
                      className="text-primary font-semibold hover:underline text-sm"
                    >
                      Ver carrito →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {isAuthenticated ? (
              <div
                className="hidden sm:flex items-center gap-2 relative"
                ref={userDropdownRef}
              >
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-gray-50 hover:bg-accent/40 text-dark hover:text-primary transition shadow"
                  onClick={() => setUserDropdown((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={userDropdown}
                  type="button"
                >
                  <span className="truncate max-w-[120px]">
                    {usuario.nombre}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      userDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                    <span className="block px-4 py-2 text-xs text-muted mb-1">
                      Mi cuenta
                    </span>
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-dark hover:bg-accent/40 hover:text-primary rounded transition"
                      onClick={() => setUserDropdown(false)}
                    >
                      Mis datos
                    </Link>
                    <Link
                      to="/mis-direcciones"
                      className="block px-4 py-2 text-dark hover:bg-accent/40 hover:text-primary rounded transition"
                      onClick={() => setUserDropdown(false)}
                    >
                      Mis direcciones
                    </Link>

                    {usuario?.rol === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-dark hover:bg-accent/40 hover:text-primary rounded transition"
                        onClick={() => setUserDropdown(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/mis-pedidos"
                      className="block px-4 py-2 text-dark hover:bg-accent/40 hover:text-primary rounded transition"
                      onClick={() => setUserDropdown(false)}
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded transition font-semibold"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/signin"
                className="hidden sm:inline px-4 py-2 rounded-full font-semibold bg-primary text-white hover:bg-secondary transition-all duration-200 shadow"
              >
                Ingresar
              </NavLink>
            )}
            <button
              className="md:hidden ml-2 p-2 rounded-full hover:bg-accent/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Search Modal */}
        {showMobileSearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md p-6 flex gap-2"
            >
              <input
                type="text"
                placeholder="Buscar productos, marcas, categorías..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-md border border-gray-200 focus:ring-2 focus:ring-primary text-gray-900 text-base outline-none bg-white"
                autoFocus
              />
              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white font-semibold px-5 py-2 rounded-r-md transition"
              >
                Buscar
              </button>
              <button
                type="button"
                className="ml-2 text-gray-400 hover:text-primary text-2xl font-bold"
                onClick={() => setShowMobileSearch(false)}
                aria-label="Cerrar búsqueda"
              >
                ×
              </button>
            </form>
          </div>
        )}

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />
        {/* Mobile Nav Drawer */}
        <div
          className={`fixed top-0 right-0 z-50 w-4/5 max-w-xs h-full bg-white/95 shadow-2xl transform transition-transform duration-300 rounded-l-3xl border-l border-accent flex flex-col ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          <button
            className="self-end m-4 p-2 rounded-full hover:bg-accent/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <svg
              className="w-7 h-7 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col gap-2 px-8 mt-4">
            {navLinks.map((link) => (
              <div key={link.label} className="flex flex-col">
                <button
                  className="py-3 px-4 rounded-full font-semibold text-lg flex items-center justify-between bg-gray-50 hover:bg-accent/40 hover:text-primary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() =>
                    setMobileDropdown(
                      mobileDropdown === link.label ? null : link.label
                    )
                  }
                  aria-haspopup="true"
                  aria-expanded={mobileDropdown === link.label}
                  type="button"
                >
                  {link.label}
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      mobileDropdown === link.label ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {mobileDropdown === link.label && (
                  <div className="flex flex-col pl-4 border-l border-accent/40 bg-white/90 rounded-b-xl">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="py-2 px-2 text-dark hover:bg-accent/40 hover:text-primary rounded transition"
                        onClick={() => {
                          setOpen(false);
                          setMobileDropdown(null);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <NavLink
              to="/carrito"
              className="py-3 px-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-accent/60 hover:text-primary transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl text-secondary">🛒</span> Carrito
            </NavLink>
            <NavLink
              to="/signin"
              className="py-3 px-4 rounded-full font-semibold text-lg bg-primary text-white hover:bg-secondary transition-all duration-200 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setOpen(false)}
            >
              Ingresar
            </NavLink>
            <NavLink
              to="/buscar"
              className="py-3 px-4 rounded-full font-semibold text-lg text-dark hover:bg-accent/60 hover:text-primary transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setOpen(false)}
            >
              Todos los productos
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
}
