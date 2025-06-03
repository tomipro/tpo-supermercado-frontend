import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

// Simulación de productos con más detalles
const destacados = [
	{
		name: 'Manzana Roja',
		img: [
			'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80',
			'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
			'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
		],
		price: 500,
		brand: 'La Huerta',
		weight: '1kg',
		offer: '10% OFF',
		bestSeller: true,
		description: 'Manzanas frescas seleccionadas, ideales para consumir solas o en postres. Cultivadas en el Alto Valle de Río Negro.',
		category: 'Verdulería',
		subcategory: 'Frutas',
		stock: 25,
		ingredients: 'Manzana roja 100%',
		origin: 'Argentina',
		nutrition: [
			{ label: 'Energía', value: '52 kcal' },
			{ label: 'Carbohidratos', value: '14g' },
			{ label: 'Azúcares', value: '10g' },
			{ label: 'Fibra', value: '2.4g' },
			{ label: 'Vitamina C', value: '7% VD' },
		],
		sku: 'MANZ-001',
	},
	{
		name: 'Leche Entera',
		img: [
			'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
			'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
		],
		price: 800,
		brand: 'La Serenísima',
		weight: '1L',
		offer: null,
		bestSeller: false,
		description: 'Leche entera de primera calidad, fuente de calcio y vitaminas. Ideal para toda la familia.',
		category: 'Lácteos',
		subcategory: 'Leche',
		stock: 40,
		ingredients: 'Leche entera, vitamina D.',
		origin: 'Argentina',
		nutrition: [
			{ label: 'Energía', value: '61 kcal' },
			{ label: 'Grasas', value: '3.3g' },
			{ label: 'Proteínas', value: '3.2g' },
			{ label: 'Calcio', value: '120mg' },
		],
		sku: 'LECH-001',
	},
	{
		name: 'Pan Integral',
		img: [
			'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
		],
		price: 650,
		brand: 'Bimbo',
		weight: '500g',
		offer: 'Nuevo',
		bestSeller: false,
		description: 'Pan integral rico en fibras, ideal para una alimentación saludable.',
		category: 'Panadería',
		subcategory: 'Pan',
		stock: 12,
		ingredients: 'Harina integral, agua, levadura, sal, aceite vegetal.',
		origin: 'Argentina',
		nutrition: [
			{ label: 'Energía', value: '250 kcal' },
			{ label: 'Carbohidratos', value: '45g' },
			{ label: 'Fibra', value: '7g' },
			{ label: 'Proteínas', value: '9g' },
		],
		sku: 'PAN-001',
	},
	{
		name: 'Bife de Chorizo',
		img: [
			'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
		],
		price: 2500,
		brand: 'Carnes Premium',
		weight: '500g',
		offer: null,
		bestSeller: true,
		description: 'Corte premium de carne vacuna, tierno y sabroso. Ideal para la parrilla.',
		category: 'Carnes',
		subcategory: 'Vacuna',
		stock: 8,
		ingredients: 'Carne vacuna 100%',
		origin: 'Argentina',
		nutrition: [
			{ label: 'Energía', value: '242 kcal' },
			{ label: 'Proteínas', value: '26g' },
			{ label: 'Grasas', value: '15g' },
			{ label: 'Hierro', value: '2.6mg' },
		],
		sku: 'BIFE-001',
	},
];

function slugify(name) {
	return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/1046/1046857.png";

export default function ProductDetailPage() {
	const { slug, id } = useParams();
	const navigate = useNavigate();
	const { token } = useAuth();
	const { refreshCarrito } = useCart();
	const [product, setProduct] = useState(null);
	const [mainImgIdx, setMainImgIdx] = useState(0);
	const [qty, setQty] = useState(1);
	const [loading, setLoading] = useState(true);
	const [addCartLoading, setAddCartLoading] = useState(false);
	const [addCartMsg, setAddCartMsg] = useState("");
	const [added, setAdded] = useState(false);
	const [units, setUnits] = useState(0);

	useEffect(() => {
		setLoading(true);
		if (id) {
			fetch(`http://localhost:4040/producto/id/${id}`)
				.then(res => {
					if (!res.ok) throw new Error("No encontrado");
					return res.json();
				})
				.then(data => {
					// Si el backend devuelve null, undefined o un objeto vacío, muestra "no encontrado"
					if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
						setProduct(null);
					} else {
						setProduct(data);
					}
					setMainImgIdx(0);
					setQty(1);
					setLoading(false);
				})
				.catch(() => {
					setProduct(null);
					setLoading(false);
				});
		} else if (slug) {
			const found = destacados.find(p => slugify(p.name) === slug);
			setProduct(found || null);
			setMainImgIdx(0);
			setQty(1);
			setLoading(false);
		} else {
			setProduct(null);
			setLoading(false);
		}
	// eslint-disable-next-line
	}, [slug, id]);

	// Skeleton loading UI
	if (loading) {
		return (
			<div className="max-w-5xl mx-auto mt-10 px-2 sm:px-6 animate-pulse">
				<div className="h-6 w-1/3 bg-gray-200 rounded mb-6" />
				<div className="flex flex-col md:flex-row gap-10">
					<div className="flex flex-col items-center md:items-start gap-4 flex-1 min-w-[260px]">
						<div className="w-64 h-64 bg-gray-200 rounded-2xl mb-4" />
						<div className="flex gap-2 mt-2">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="w-16 h-16 bg-gray-200 rounded-lg" />
							))}
						</div>
					</div>
					<div className="flex-1 flex flex-col gap-2">
						<div className="h-8 w-2/3 bg-gray-200 rounded mb-2" />
						<div className="h-5 w-1/3 bg-gray-100 rounded mb-2" />
						<div className="h-4 w-1/4 bg-gray-100 rounded mb-2" />
						<div className="h-10 w-1/4 bg-gray-200 rounded mb-2" />
						<div className="h-4 w-1/2 bg-gray-100 rounded mb-2" />
						<div className="h-20 w-full bg-gray-100 rounded mb-2" />
						<div className="h-8 w-1/3 bg-gray-200 rounded mb-2" />
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
				<h2 className="text-2xl font-bold mb-4 text-red-600">Producto no encontrado</h2>
				<button
					className="mt-4 px-4 py-2 bg-primary text-white rounded"
					onClick={() => navigate(-1)}
				>
					Volver atrás
				</button>
			</div>
		);
	}

	// Unifica imágenes
	const images =
		(Array.isArray(product.imagenes)
			? product.imagenes.map(img =>
				// Si img es string, úsalo. Si es objeto, busca .imagen o .url
				typeof img === "string"
					? img
					: img?.imagen || img?.url || ""
			)
			: [])
		|| (Array.isArray(product.img) && product.img)
		|| [];

	const mainImg = images[mainImgIdx] || FALLBACK_IMG;

	// Unifica campos
	const nombre = product.nombre || product.name || "";
	const descripcion = product.descripcion || product.description || "";
	const marca = product.marca || product.brand || "";
	const precio = product.precio ?? product.price ?? "";
	const peso = product.unidad_medida || product.weight || "";
	const descuento = product.descuento ?? product.offer ?? "";
	const bestSeller = product.bestSeller;
	// Mejorar obtención de categoría y subcategoría
	const categoriaObj = product.categoria || {};
	const subcategoriaObj = product.subcategoria || {};
	const categoriaNombre =
		(typeof categoriaObj === "string" && categoriaObj) ||
		categoriaObj.nombre ||
		product.category ||
		"";
	const subcategoriaNombre =
		(typeof subcategoriaObj === "string" && subcategoriaObj) ||
		subcategoriaObj.nombre ||
		product.subcategory ||
		"";
	const stock = product.stock ?? 0;
	const sku = product.sku || product.codigo || "";
	const origen = product.origen || product.origin || "";
	const ingredientes = product.ingredientes || product.ingredients || "";

	const relacionados = destacados.filter(p =>
		(p.category === (product.category || product.categoria?.nombre)) &&
		(p.name !== (product.name || product.nombre))
	).slice(0, 3);

	function handlePrevImg() {
		setMainImgIdx(idx => (idx - 1 + images.length) % images.length);
	}
	function handleNextImg() {
		setMainImgIdx(idx => (idx + 1) % images.length);
	}

	async function handleAddToCart() {
		if (!product?.id || !qty) return;
		setAddCartLoading(true);
		setAddCartMsg("");
		try {
			const res = await fetch(`http://localhost:4040/carritos/${product.id}?cantidad=${qty}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.ok) {
				setAddCartMsg("Producto agregado al carrito.");
				refreshCarrito();
				setUnits(units + qty);
				setAdded(true);
				setTimeout(() => setAdded(false), 1200);
			} else {
				setAddCartMsg("No se pudo agregar al carrito.");
			}
		} catch {
			setAddCartMsg("No se pudo agregar al carrito.");
		}
		setAddCartLoading(false);
		setTimeout(() => setAddCartMsg(""), 2000);
	}

	return (
		<div
			className="max-w-5xl mx-auto mt-10 flex flex-col gap-8 px-2 sm:px-6"
			style={{
				minHeight: "calc(100vh - 120px)",
				position: "relative",
			}}
		>
			{/* Fondo elegante y spotlight */}
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 z-0"
				style={{
					background: "linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)",
					zIndex: 0,
				}}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-60"
				style={{
					width: 600,
					height: 400,
					background: "radial-gradient(ellipse at center, #fff 60%, #e0e7ff 100%)",
					zIndex: 1,
				}}
			/>
			<div className="relative z-10">
				{/* Breadcrumb */}
				<nav className="mb-2 text-sm text-muted flex gap-2 items-center">
					<Link to="/" className="hover:underline text-primary">Inicio</Link>
					{categoriaNombre && (
						<>
							<span className="mx-1">/</span>
							<Link
								to={`/categorias?cat=${categoriaNombre.toLowerCase()}`}
								className="hover:underline text-primary"
							>
								{categoriaNombre}
							</Link>
						</>
					)}
					{subcategoriaNombre && (
						<>
							<span className="mx-1">/</span>
							<Link
								to={`/categorias?cat=${categoriaNombre.toLowerCase()}&sub=${subcategoriaNombre.toLowerCase()}`}
								className="hover:underline text-primary"
							>
								{subcategoriaNombre}
							</Link>
						</>
					)}
					<span className="mx-1">/</span>
					<span className="text-dark">{nombre}</span>
				</nav>
				{/* Main layout */}
				<div className="flex flex-col md:flex-row gap-10">
					{/* Galería de imágenes */}
					<div className="flex flex-col items-center md:items-start gap-4 flex-1 min-w-[260px]">
						<div className="relative w-64 h-64 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border border-gray-100">
							<img
								src={mainImg}
								alt={nombre}
								className="object-contain w-full h-full"
								onError={e => { e.target.src = FALLBACK_IMG }}
							/>
							{images.length > 1 && (
								<>
									<button
										className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary/90 text-primary hover:text-white rounded-full w-9 h-9 flex items-center justify-center shadow transition border border-gray-200"
										onClick={handlePrevImg}
										aria-label="Anterior foto"
										type="button"
										style={{ padding: 0, lineHeight: 0 }}
									>
										<svg
											className="w-6 h-6"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											stroke="currentColor"
											strokeWidth={2.5}
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									<button
										className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary/90 text-primary hover:text-white rounded-full w-9 h-9 flex items-center justify-center shadow transition border border-gray-200"
										onClick={handleNextImg}
										aria-label="Siguiente foto"
										type="button"
										style={{ padding: 0, lineHeight: 0 }}
									>
										<svg
											className="w-6 h-6"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											stroke="currentColor"
											strokeWidth={2.5}
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</>
							)}
						</div>
						<div className="flex gap-2 mt-2">
							{images.map((img, i) => (
								<button
									key={i}
									className={`w-16 h-16 rounded-lg border-2 ${mainImgIdx === i ? "border-primary ring-2 ring-primary" : "border-gray-200"} overflow-hidden bg-white shadow-sm transition`}
									onClick={() => setMainImgIdx(i)}
									tabIndex={0}
									style={{
										background: "#fff"
									}}
								>
									<img src={img} alt={`Vista ${i + 1}`} className="object-cover w-full h-full" onError={e => { e.target.src = FALLBACK_IMG }} />
								</button>
							))}
						</div>
					</div>
					{/* Info principal */}
					<div className="flex-1 flex flex-col gap-2">
						<h1 className="text-3xl font-bold mb-1 text-primary drop-shadow-sm">{nombre}</h1>
						<div className="text-lg text-muted mb-1">{marca} {peso && `· ${peso}`}</div>
						<div className="flex gap-2 mb-2">
							{descuento && (
								<span className="inline-block bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full shadow">
									{typeof descuento === "string" ? descuento : `${descuento}% OFF`}
								</span>
							)}
							{bestSeller && (
								<span className="inline-block bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
									Más vendido
								</span>
							)}
						</div>
						<div className="text-2xl font-bold text-primary mb-2 drop-shadow">${precio}</div>
						<div className="text-xs text-gray-400 mb-2">
							Precio sin impuestos nacionales: ${precio ? Math.round(precio / 1.21) : 0}
						</div>
						<div className="mb-2 text-gray-700">{descripcion}</div>
						<div className="flex items-center gap-4 mb-4">
							<span className={`text-sm font-medium ${stock > 5 ? 'text-secondary' : 'text-red-500'}`}>
								{stock > 5 ? 'En stock' : 'Últimas unidades'}
							</span>
							{sku && <span className="text-xs text-gray-400">SKU: {sku}</span>}
							{origen && <span className="text-xs text-gray-400">Origen: {origen}</span>}
						</div>
						{/* Cantidad y agregar */}
						<div className="flex items-center gap-3 mb-4 relative">
							<label htmlFor="qty" className="text-sm text-gray-700">Cantidad:</label>
							<input
								id="qty"
								type="number"
								min={1}
								max={stock}
								value={qty}
								onChange={e => setQty(Math.max(1, Math.min(stock, Number(e.target.value))))}
								className="w-20 px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-primary"
							/>
							<button
								className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-2 rounded-lg shadow transition text-base"
								onClick={handleAddToCart}
								disabled={addCartLoading}
							>
								{addCartLoading ? "Agregando..." : "Agregar al carrito"}
							</button>
							<AnimatePresence>
								{added && (
									<motion.span
										initial={{ opacity: 0, y: 10, scale: 0.9 }}
										animate={{ opacity: 1, y: -10, scale: 1.1 }}
										exit={{ opacity: 0, y: 0, scale: 0.9 }}
										transition={{ duration: 0.5 }}
										className="absolute left-1/2 -translate-x-1/2 -top-7 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow font-bold pointer-events-none"
									>
										¡Agregado!
									</motion.span>
								)}
							</AnimatePresence>
							{units > 0 && (
								<span className="absolute right-0 bottom-0 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold pointer-events-none">
									x{units}
								</span>
							)}
							{addCartMsg && (
								<span className="ml-2 text-green-600 text-sm">{addCartMsg}</span>
							)}
						</div>
						{/* Categoría y subcategoría */}
						<div className="flex gap-2 text-sm text-muted mb-2">
							<span>Categoría:</span>
							{categoriaNombre ? (
								<>
									<Link to={`/categorias?cat=${categoriaNombre.toLowerCase()}`} className="text-primary hover:underline">{categoriaNombre}</Link>
									{subcategoriaNombre && (
										<>
											<span>/</span>
											<Link to={`/categorias?cat=${categoriaNombre.toLowerCase()}&sub=${subcategoriaNombre.toLowerCase()}`} className="text-primary hover:underline">{subcategoriaNombre}</Link>
										</>
									)}
								</>
							) : (
								<span className="text-gray-400">Sin categoría</span>
							)}
						</div>
					</div>
				</div>
				{/* Tabs de detalles */}
				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Ficha técnica */}
					<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
						<h2 className="text-xl font-bold mb-3 text-dark">Ficha técnica</h2>
						<ul className="text-gray-700 text-base space-y-2">
							<li><span className="font-semibold">Marca:</span> {marca}</li>
							<li><span className="font-semibold">Peso/Contenido:</span> {peso}</li>
							{categoriaNombre && <li><span className="font-semibold">Categoría:</span> {categoriaNombre}</li>}
							{subcategoriaNombre && <li><span className="font-semibold">Subcategoría:</span> {subcategoriaNombre}</li>}
							{origen && <li><span className="font-semibold">Origen:</span> {origen}</li>}
							{sku && <li><span className="font-semibold">SKU:</span> {sku}</li>}
							<li><span className="font-semibold">Stock disponible:</span> {stock}</li>
							{ingredientes && <li><span className="font-semibold">Ingredientes:</span> {ingredientes}</li>}
						</ul>
					</div>
				</div>
				{/* Productos relacionados */}
				{relacionados.length > 0 && (
					<div className="mt-10">
						<h2 className="text-xl font-bold mb-4 text-dark">Productos relacionados</h2>
						<div className="flex gap-6 flex-wrap">
							{relacionados.map(prod => (
								<Link
									key={prod.name}
									to={`/producto/${slugify(prod.name)}`}
									className="flex flex-col items-center bg-white rounded-xl shadow hover:shadow-xl transition p-4 border border-gray-100 hover:border-primary w-48"
								>
									<img
										src={prod.img[0]}
										alt={prod.name}
										className="w-20 h-20 object-cover rounded-lg mb-2"
										onError={e => { e.target.src = FALLBACK_IMG }}
									/>
									<div className="font-semibold text-base text-dark mb-1 text-center line-clamp-2">
										{prod.name}
									</div>
									<div className="text-xs text-muted mb-1 text-center">
										{prod.brand} {prod.weight && `· ${prod.weight}`}
									</div>
									<div className="text-primary font-bold text-lg mb-2 text-center">
										${prod.price}
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
				<div className="mt-8">
					<Link to="/" className="text-primary hover:underline text-sm">
						← Volver al inicio
					</Link>
				</div>
			</div>
		</div>
	);
}
