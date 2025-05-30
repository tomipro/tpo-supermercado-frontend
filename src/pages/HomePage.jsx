import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/1046/1046857.png"

function ProductCardWithFallback(props) {
	const [imgSrc, setImgSrc] = useState(props.img || FALLBACK_IMG)
	return (
		<ProductCard
			{...props}
			img={imgSrc}
			onErrorImg={FALLBACK_IMG}
			onQuickView={props.onQuickView}
			showSinImpuestos={true}
		/>
	)
}

function Carousel({ banners }) {
	const [idx, setIdx] = useState(0)
	const [imgSrc, setImgSrc] = useState(banners[0]?.img || FALLBACK_IMG)

	useEffect(() => {
		setImgSrc(banners[idx]?.img || FALLBACK_IMG)
	}, [idx, banners])

	const next = () => setIdx((idx + 1) % banners.length)
	const prev = () => setIdx((idx - 1 + banners.length) % banners.length)
	useEffect(() => {
		const timer = setInterval(next, 6000)
		return () => clearInterval(timer)
	}, [idx, banners])

	const { title, desc, cta, to } = banners[idx] || {}
	return (
		<div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg mb-10">
			<img
				src={imgSrc}
				alt={title}
				onError={() => setImgSrc(FALLBACK_IMG)}
				className="absolute inset-0 w-full h-full object-cover object-center"
			/>
			<div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
			<div className="relative z-10 flex flex-col justify-center h-full pl-6 sm:pl-16 text-white max-w-[600px]">
				<h2 className="text-2xl sm:text-4xl font-bold mb-2 drop-shadow">
					{title}
				</h2>
				<p className="mb-4 text-base sm:text-lg">{desc}</p>
				{to && cta && (
					<Link
						to={to}
						className="inline-block font-semibold px-6 py-3 rounded-lg shadow-lg bg-white/90 text-primary border-2 border-primary hover:bg-primary hover:text-white hover:border-white transition text-lg"
						style={{
							boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
							fontWeight: 700,
							letterSpacing: '0.02em'
						}}
					>
						{cta}
					</Link>
				)}
			</div>
			<button
				onClick={prev}
				className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-primary rounded-full w-9 h-9 flex items-center justify-center shadow transition"
			>
				<span className="text-2xl">&#8592;</span>
			</button>
			<button
				onClick={next}
				className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-primary rounded-full w-9 h-9 flex items-center justify-center shadow transition"
			>
				<span className="text-2xl">&#8594;</span>
			</button>
			<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
				{banners.map((_, i) => (
					<span
						key={i}
						className={`block w-3 h-3 rounded-full ${
							i === idx ? 'bg-accent' : 'bg-white/60'
						}`}
					></span>
				))}
			</div>
		</div>
	)
}

function CategoryCard({ name, img, to }) {
	const [imgSrc, setImgSrc] = useState(img)
	return (
		<Link
			to={to}
			className="flex flex-col items-center bg-white rounded-xl shadow hover:shadow-xl transition group p-3 sm:p-4 border border-gray-100 hover:border-primary"
		>
			<img
				src={imgSrc}
				alt={name}
				onError={() => setImgSrc(FALLBACK_IMG)}
				className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full mb-2 border-2 border-accent group-hover:scale-105 transition"
			/>
			<span className="text-base sm:text-lg font-medium text-dark group-hover:text-primary transition text-center">
				{name}
			</span>
		</Link>
	)
}

function PromotionsCard({ img, title, desc, cta, to }) {
	return (
		<div className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 hover:border-primary p-6 flex flex-col items-center transition">
			<img
				src={img}
				alt={title}
				className="w-24 h-24 object-cover rounded-lg mb-3"
				style={{ objectFit: "cover" }}
			/>
			<div className="font-bold text-lg text-dark mb-1 text-center">{title}</div>
			<div className="text-sm text-muted mb-3 text-center">{desc}</div>
			{to && cta && (
				<Link
					to={to}
					className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded font-semibold text-sm shadow transition"
				>
					{cta}
				</Link>
			)}
		</div>
	)
}

function ProductQuickView({ product, onClose }) {
	const [qty, setQty] = useState(1);

	useEffect(() => {
		setQty(1);
	}, [product]);

	useEffect(() => {
		if (!product) return;
		const handler = e => { if (e.key === 'Escape') onClose(); };
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [onClose, product]);

	if (!product) return null;

	const stock = product.stock ?? 0;
	const description = product.descripcion || "";
	const price = product.precio;
	const name = product.nombre;
	const brand = product.marca;
	const img =
		(Array.isArray(product.imagenes) && product.imagenes[0]?.imagen)
		|| (Array.isArray(product.imagenes) && typeof product.imagenes[0] === "string" && product.imagenes[0])
		|| product.imagenUrl
		|| product.img;

	function handleBgClick(e) {
		if (e.target === e.currentTarget) onClose();
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
			onClick={handleBgClick}
			aria-modal="true"
			role="dialog"
		>
			<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 relative flex flex-col md:flex-row overflow-hidden">
				<div className="flex-1 flex items-center justify-center bg-gray-50 p-6 md:p-8">
					{img ? (
						<img
							src={img}
							alt={name}
							className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
							draggable={false}
						/>
					) : (
						<div className="w-40 h-40 md:w-56 md:h-56 bg-gray-100 rounded-xl shadow-lg flex items-center justify-center text-5xl">
							🛒
						</div>
					)}
				</div>
				<div className="flex-1 flex flex-col p-6 md:p-8">
					<button
						className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
						onClick={onClose}
						aria-label="Cerrar"
						tabIndex={0}
					>
						×
					</button>
					<div className="flex items-center gap-2 mb-2">
						<span className="font-bold text-xl text-dark">{name}</span>
						{product.descuento > 0 && (
							<span className="bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full shadow">
								{product.descuento}% OFF
							</span>
						)}
					</div>
					<div className="text-sm text-muted mb-1">
						{brand}
					</div>
					<div className="text-primary font-bold text-2xl mb-1">
						{price !== undefined ? `$${price}` : ""}
					</div>
					<div className="text-xs text-gray-400 mb-3">
						{price !== undefined ? `Precio sin impuestos nacionales: $${Math.round(price / 1.21)}` : ""}
					</div>
					{description && (
						<div className="text-gray-600 text-sm mb-4">{description}</div>
					)}
					<div className="flex items-center gap-3 mb-4">
						{stock > 0 && (
							<span className="text-xs font-medium text-secondary">En stock: {stock}</span>
						)}
					</div>
					<div className="flex items-center gap-2 mb-6">
						<label htmlFor="qty" className="text-sm text-gray-700">
							Cantidad:
						</label>
						<input
							id="qty"
							type="number"
							min={1}
							max={stock || 1}
							value={qty}
							onChange={e => setQty(Math.max(1, Math.min(stock || 1, Number(e.target.value))))}
							className="w-16 px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-primary"
						/>
					</div>
					<button
						className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-lg shadow transition text-base w-full flex items-center justify-center gap-2"
						onClick={() => { /* lógica agregar al carrito */ }}
					>
						<span>Agregar al carrito</span>
						<span className="font-bold">×{qty}</span>
					</button>
				</div>
			</div>
		</div>
	)
}

function SkeletonCategoryCard() {
	return (
		<div className="animate-pulse bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
			<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mb-2" />
			<div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
		</div>
	)
}

function SkeletonProductCard() {
	return (
		<div className="animate-pulse bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100 min-w-[220px] max-w-[240px]">
			<div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg mb-2" />
			<div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
			<div className="h-3 w-1/2 bg-gray-100 rounded mb-1" />
			<div className="h-5 w-1/3 bg-gray-200 rounded mb-2" />
		</div>
	)
}

function SkeletonPromoCard() {
	return (
		<div className="animate-pulse bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col items-center">
			<div className="w-24 h-24 bg-gray-200 rounded-lg mb-3" />
			<div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
			<div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
			<div className="h-5 w-1/3 bg-gray-200 rounded mb-2" />
		</div>
	)
}

export default function HomePage() {
	const [quickView, setQuickView] = useState(null);
	const [banners, setBanners] = useState([]);
	const [categories, setCategories] = useState([]);
	const [promos, setPromos] = useState([]);
	const [destacados, setDestacados] = useState([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [loadingPromos, setLoadingPromos] = useState(true);
	const [loadingDestacados, setLoadingDestacados] = useState(true);

	// Fetch banners (puede ser endpoint propio, aquí ejemplo hardcodeado)
	useEffect(() => {
		setBanners([
			{
				img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
				title: '¡Super Ofertas de la Semana!',
				desc: 'Aprovechá descuentos exclusivos en cientos de productos.',
				cta: 'Ver promociones',
				to: '/promociones',
			},
			{
				img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80',
				title: 'Envío gratis en compras mayores a $15.000',
				desc: 'Recibí tu compra en casa sin cargo.',
				cta: 'Ver condiciones',
				to: '/',
			},
			{
				img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=1200&q=80',
				title: '¡Registrate y obtené 10% OFF!',
				desc: 'Solo para nuevos usuarios. ¡No te lo pierdas!',
				cta: 'Registrarse',
				to: '/signup',
			},
		]);
	}, []);

	// Categorías
	useEffect(() => {
		setLoadingCategories(true);
		fetch("http://localhost:4040/categorias")
			.then(res => res.json())
			.then(catData => {
				setCategories(
					Array.isArray(catData.content)
						? catData.content.map(c => ({
							name: c.nombre,
							to: `/categorias?cat=${c.id}`,
							img: (c.productos && c.productos[0]?.imagenes?.[0]?.imagen) || FALLBACK_IMG,
						}))
						: []
				);
			})
			.catch(() => setCategories([]))
			.finally(() => setLoadingCategories(false));
	}, []);

	// Promociones (puede ser endpoint propio, aquí ejemplo hardcodeado)
	useEffect(() => {
		setLoadingPromos(true);
		setTimeout(() => {
			setPromos([
				{
					img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
					title: '2x1 en Gaseosas',
					desc: 'Solo por esta semana, llevá 2 y pagá 1 en todas las gaseosas seleccionadas.',
					cta: 'Ver productos',
					to: '/promociones',
				},
				{
					img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
					title: '20% OFF en Frutas y Verduras',
					desc: 'Comé saludable con descuento en productos frescos.',
					cta: 'Comprar ahora',
					to: '/categorias?cat=verduleria',
				},
				{
					img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
					title: 'Envío gratis',
					desc: 'En compras mayores a $15.000, el envío es gratis a todo el país.',
					cta: 'Ver más',
					to: '/',
				},
			]);
			setLoadingPromos(false);
		}, 400); // Simula fetch
	}, []);

	// Productos destacados
	useEffect(() => {
		setLoadingDestacados(true);
		fetch("http://localhost:4040/producto?destacados=true")
			.then(res => res.json())
			.then(prodData => {
				setDestacados(Array.isArray(prodData.content) ? prodData.content : []);
			})
			.catch(() => setDestacados([]))
			.finally(() => setLoadingDestacados(false));
	}, []);

	return (
		<div className="w-full flex flex-col items-center">
			{/* Carousel */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6">
				{banners.length > 0 && <Carousel banners={banners} />}
			</div>
			{/* Categorías */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6 mb-12">
				<h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-dark">
					Categorías populares
				</h2>
				{loadingCategories ? (
					<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<SkeletonCategoryCard key={i} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
						{categories.map(cat => (
							<CategoryCard key={cat.name} {...cat} />
						))}
					</div>
				)}
			</div>
			{/* Promociones destacadas */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6 mb-12">
				<h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-dark">
					Promociones destacadas
				</h2>
				{loadingPromos ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{Array.from({ length: 3 }).map((_, i) => (
							<SkeletonPromoCard key={i} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{promos.map(promo => (
							<PromotionsCard key={promo.title} {...promo} />
						))}
					</div>
				)}
			</div>
			{/* Productos destacados */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6 mb-16">
				<h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-dark">
					Productos destacados
				</h2>
				<div className="relative">
					{/* Mobile: slider horizontal con scroll snap */}
					{loadingDestacados ? (
						<div className="flex gap-4 overflow-x-auto pb-2 sm:hidden">
							{Array.from({ length: 4 }).map((_, i) => (
								<SkeletonProductCard key={i} />
							))}
						</div>
					) : (
						<div className="flex gap-4 overflow-x-auto pb-2 sm:hidden"
							style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
							{destacados.map(prod => (
								<div
									key={prod.id || prod.nombre}
									className="min-w-[220px] max-w-[240px] flex-shrink-0 flex h-full"
									style={{ scrollSnapAlign: 'center' }}
								>
									<ProductCardWithFallback
										name={prod.nombre}
										brand={prod.marca}
										img={
											(Array.isArray(prod.imagenes) && prod.imagenes[0]?.imagen)
											|| (Array.isArray(prod.imagenes) && typeof prod.imagenes[0] === "string" && prod.imagenes[0])
											|| undefined
										}
										price={prod.precio}
										weight={prod.unidad_medida}
										offer={prod.descuento > 0 ? `${prod.descuento}% OFF` : undefined}
										bestSeller={prod.bestSeller}
										onQuickView={setQuickView}
									/>
								</div>
							))}
						</div>
					)}
					{/* Desktop: masonry-like grid */}
					{loadingDestacados ? (
						<div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-10 auto-rows-[1fr]">
							{Array.from({ length: 6 }).map((_, i) => (
								<SkeletonProductCard key={i} />
							))}
						</div>
					) : (
						<div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-10 auto-rows-[1fr]">
							{destacados.map(prod => (
								<div key={prod.id || prod.nombre} className="flex h-full min-h-0">
									<ProductCardWithFallback
										name={prod.nombre}
										brand={prod.marca}
										img={
											(Array.isArray(prod.imagenes) && prod.imagenes[0]?.imagen)
											|| (Array.isArray(prod.imagenes) && typeof prod.imagenes[0] === "string" && prod.imagenes[0])
											|| undefined
										}
										price={prod.precio}
										weight={prod.unidad_medida}
										offer={prod.descuento > 0 ? `${prod.descuento}% OFF` : undefined}
										bestSeller={prod.bestSeller}
										onQuickView={setQuickView}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			{quickView && (
				<ProductQuickView product={quickView} onClose={() => setQuickView(null)} />
			)}
		</div>
	)
}
