import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
	const { slug } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [mainImgIdx, setMainImgIdx] = useState(0);
	const [qty, setQty] = useState(1);

	useEffect(() => {
		const found = destacados.find(p => slugify(p.name) === slug);
		setProduct(found || null);
		setMainImgIdx(0);
		setQty(1);
	}, [slug]);

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

	const mainImg = product.img[mainImgIdx] || FALLBACK_IMG;
	const relacionados = destacados.filter(p => p.category === product.category && p.name !== product.name).slice(0, 3);

	function handlePrevImg() {
		setMainImgIdx(idx => (idx - 1 + product.img.length) % product.img.length);
	}
	function handleNextImg() {
		setMainImgIdx(idx => (idx + 1) % product.img.length);
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
					<span>/</span>
					<Link to={`/categorias?cat=${product.category?.toLowerCase()}`} className="hover:underline text-primary">{product.category}</Link>
					{product.subcategory && (
						<>
							<span>/</span>
							<Link to={`/categorias?cat=${product.category?.toLowerCase()}&sub=${product.subcategory?.toLowerCase()}`} className="hover:underline text-primary">{product.subcategory}</Link>
						</>
					)}
					<span>/</span>
					<span className="text-dark">{product.name}</span>
				</nav>
				{/* Main layout */}
				<div className="flex flex-col md:flex-row gap-10">
					{/* Galería de imágenes */}
					<div className="flex flex-col items-center md:items-start gap-4 flex-1 min-w-[260px]">
						<div className="relative w-64 h-64 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border border-gray-100">
							<img
								src={mainImg}
								alt={product.name}
								className="object-contain w-full h-full"
								onError={e => { e.target.src = FALLBACK_IMG }}
							/>
							{product.img.length > 1 && (
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
							{product.img.map((img, i) => (
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
						<h1 className="text-3xl font-bold mb-1 text-primary drop-shadow-sm">{product.name}</h1>
						<div className="text-lg text-muted mb-1">{product.brand} {product.weight && `· ${product.weight}`}</div>
						<div className="flex gap-2 mb-2">
							{product.offer && (
								<span className="inline-block bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full shadow">
									{product.offer}
								</span>
							)}
							{product.bestSeller && (
								<span className="inline-block bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
									Más vendido
								</span>
							)}
						</div>
						<div className="text-2xl font-bold text-primary mb-2 drop-shadow">${product.price}</div>
						<div className="text-xs text-gray-400 mb-2">
							Precio sin impuestos nacionales: ${Math.round(product.price / 1.21)}
						</div>
						<div className="mb-2 text-gray-700">{product.description}</div>
						<div className="flex items-center gap-4 mb-4">
							<span className={`text-sm font-medium ${product.stock > 5 ? 'text-secondary' : 'text-red-500'}`}>
								{product.stock > 5 ? 'En stock' : 'Últimas unidades'}
							</span>
							<span className="text-xs text-gray-400">SKU: {product.sku}</span>
							<span className="text-xs text-gray-400">Origen: {product.origin}</span>
						</div>
						{/* Cantidad y agregar */}
						<div className="flex items-center gap-3 mb-4">
							<label htmlFor="qty" className="text-sm text-gray-700">Cantidad:</label>
							<input
								id="qty"
								type="number"
								min={1}
								max={product.stock}
								value={qty}
								onChange={e => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
								className="w-20 px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-primary"
							/>
							<button
								className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-2 rounded-lg shadow transition text-base"
								onClick={() => {/* lógica agregar al carrito */}}
							>
								Agregar al carrito
							</button>
						</div>
						{/* Categoría y subcategoría */}
						<div className="flex gap-2 text-sm text-muted mb-2">
							<span>Categoría:</span>
							<Link to={`/categorias?cat=${product.category?.toLowerCase()}`} className="text-primary hover:underline">{product.category}</Link>
							{product.subcategory && (
								<>
									<span>/</span>
									<Link to={`/categorias?cat=${product.category?.toLowerCase()}&sub=${product.subcategory?.toLowerCase()}`} className="text-primary hover:underline">{product.subcategory}</Link>
								</>
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
							<li><span className="font-semibold">Marca:</span> {product.brand}</li>
							<li><span className="font-semibold">Peso/Contenido:</span> {product.weight}</li>
							<li><span className="font-semibold">Origen:</span> {product.origin}</li>
							<li><span className="font-semibold">SKU:</span> {product.sku}</li>
							<li><span className="font-semibold">Stock disponible:</span> {product.stock}</li>
							<li><span className="font-semibold">Ingredientes:</span> {product.ingredients}</li>
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
