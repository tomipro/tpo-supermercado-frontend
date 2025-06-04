import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../context/CartContext";
import DolarCotizacion from "../components/DolarCotizacion";
import dinoLogo from "../assets/dino_logo.png";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState([
    { name: "Ver todos", to: "/categorias" },
  ]);
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

  // Fetch categorías reales del backend para el dropdown
  useEffect(() => {
    fetch("http://localhost:4040/categorias")
      .then((res) => res.json())
      .then((data) => {
        const cats = Array.isArray(data.content)
          ? // Filtra solo las que tienen parentId === null (principales)
            data.content.filter((cat) => cat.parentId === null)
          : [];
        setCategoriesDropdown(
          [{ name: "Ver todos", to: "/buscar" }].concat(
            cats.map((cat) => ({
              name: cat.nombre,
              to: `/buscar?categoriaId=${cat.id}`,
            }))
          )
        );
      })
      .catch(() => {
        setCategoriesDropdown([{ name: "Ver todos", to: "/buscar" }]);
      });
  }, []);

  // Solo reemplaza el dropdown de categorías en navLinks
  const navLinks = [
    { label: "Categorías", dropdown: categoriesDropdown },
    // { to: '/admin', label: 'Admin' }, // Solo para admin, oculto por ahora
  ];

  // Cerrar dropdown de categorías al clickear fuera
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (!dropdown) return;
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdown]);

  return (
    <>
      {/* Barra superior con el dólar */}
      <div className="w-full bg-green-50 py-1 px-4 border-b border-green-200">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <DolarCotizacion compact />
          <div className="text-xs text-gray-500">
            Actualizado: {new Date().toLocaleTimeString("es-AR")}
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100">
        <nav
          className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-14 h-[76px] gap-2"
          style={{ width: "100%" }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-primary hover:opacity-90 transition-opacity select-none"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg text-white text-3xl">
              <img
                src={dinoLogo}
                alt="Logo Dino"
                style={{
                  width: 44,
                  height: 44,
                  objectFit: "contain",
                  display: "block",
                  margin: "auto",
                  transform: "scale(1.25)",
                }}
                draggable={false}
              />
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
                ref={link.label === "Categorías" ? dropdownRef : undefined}
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
                  onClick={() =>
                    setDropdown(dropdown === link.label ? null : link.label)
                  }
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
                {dropdown === "Categorías" && link.dropdown.length > 0 && (
                  <div
                    className="absolute left-0 top-full mt-0 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in"
                    style={{
                      minWidth: 400,
                      maxWidth: 700,
                      maxHeight: 420,
                      overflowY: "auto",
                      padding: "1rem 0.7rem",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(170px, 1fr))",
                      gap: "0.2rem 0.3rem",
                    }}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="px-2 py-2 text-dark hover:bg-accent/40 hover:text-primary rounded transition text-base font-medium"
                        tabIndex={0}
                        style={{
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => setDropdown(null)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* <NavLink
            to="/promociones"
            className="px-5 py-2 rounded-full font-semibold transition-all duration-200 text-base text-dark hover:bg-accent/70 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Promociones
          </NavLink> */}
            {/* <NavLink
            to="/buscar?promo=true"
            className="px-5 py-2 rounded-full font-semibold transition-all duration-200 text-base text-dark hover:bg-accent/70 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Promociones
          </NavLink> */}
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
                {/* Icono de carrito SVG */}
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
              {/* Hover: muestra productos del carrito */}
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
                                {/* Precio unitario */}
                                {item.precioUnitario !== undefined &&
                                item.precioUnitario !== null
                                  ? `Precio: $${Number(
                                      item.precioUnitario
                                    ).toFixed(2)}`
                                  : ""}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {/* Precio sin impuestos nacionales */}
                                {item.precioUnitario !== undefined &&
                                item.precioUnitario !== null
                                  ? `Sin IVA: $${Math.round(
                                      Number(item.precioUnitario) / 1.21
                                    )}`
                                  : ""}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-primary text-right min-w-[60px]">
                              {/* Subtotal por producto */}
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
                                {/* Subtotal sin IVA */}
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
                      {/* Total del carrito */}
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
                              // Calcula el total sin IVA
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
                      // uso solo el doble igual para que no considere mayusculas y minúsculas
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
                    {/* aca van mas opciones aca si necesitamos */}

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
    </>
  );
}
