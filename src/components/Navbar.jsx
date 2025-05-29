import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
// todas estas cosas vuelan cuando integro con el back
// osea provisorio por ahora

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
  // { to: '/admin', label: 'Admin' }, // Solo para admin, oculto por ahora
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  //Esto permite que el navbar sepa si el usuario está autenticado y quién es
  const { usuario, isAuthenticated, logout } = useAuth();

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (search.trim()) {
      // Redirige a /buscar con el query como parámetro
      navigate(`/buscar?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowMobileSearch(false);
    }
  }

  // Cerrar dropdown al clickear fuera
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
            Supermercado G5
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
          <NavLink
            to="/carrito"
            className="relative group p-2 rounded-full hover:bg-accent/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Carrito"
          >
            <span className="text-2xl text-secondary">🛒</span>
          </NavLink>
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
                <span className="truncate max-w-[120px]">{usuario.nombre}</span>
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
                  {/* Agregá más opciones si querés */}
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
          {/* Mobile menu button */}
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
          {/* Mobile Dropdowns */}
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
  );
}
