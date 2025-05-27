import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

// cuando integramos con back, se van estas cosas hardcodeadas

const carouselData = [
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
]

const categories = [
	{
		name: 'Verdulería',
		to: '/categorias?cat=verduleria',
		img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80',
	},
	{
		name: 'Carnes',
		to: '/categorias?cat=carnes',
		img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80',
	},
	{
		name: 'Lácteos',
		to: '/categorias?cat=lacteos',
		img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80',
	},
	{
		name: 'Panadería',
		to: '/categorias?cat=panaderia',
		img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80',
	},
	{
		name: 'Snacks',
		to: '/categorias?cat=snacks',
		img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
	},
	{
		name: 'Bebidas',
		to: '/categorias?cat=bebidas',
		img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80',
	},
	{
		name: 'Limpieza',
		to: '/categorias?cat=limpieza',
		img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80',
	},
	{
		name: 'Cuidado personal',
		to: '/categorias?cat=cuidado-personal',
		img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80',
	},
]

const promos = [
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
]

const destacados = [
	{
		name: 'Manzana Roja',
		img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=200&q=80',
		price: 500,
		brand: 'La Huerta',
		weight: '1kg',
		offer: '10% OFF',
		bestSeller: true,
	},
	{
		name: 'Leche Entera',
		img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80',
		price: 800,
		brand: 'La Serenísima',
		weight: '1L',
		offer: null,
		bestSeller: false,
	},
	{
		name: 'Pan Integral',
		img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
		price: 650,
		brand: 'Bimbo',
		weight: '500g',
		offer: 'Nuevo',
		bestSeller: false,
	},
	{
		name: 'Bife de Chorizo',
		img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80',
		price: 2500,
		brand: 'Carnes Premium',
		weight: '500g',
		offer: null,
		bestSeller: true,
	},
]

function Carousel() {
	const [idx, setIdx] = useState(0)
	const next = () => setIdx((idx + 1) % carouselData.length)
	const prev = () => setIdx((idx - 1 + carouselData.length) % carouselData.length)
	// Auto-slide
	// eslint-disable-next-line
	useState(() => {
		const timer = setInterval(next, 6000)
		return () => clearInterval(timer)
	}, [idx])

	const { img, title, desc, cta, to } = carouselData[idx]
	return (
		<div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg mb-10">
			<img
				src={img}
				alt={title}
				className="absolute inset-0 w-full h-full object-cover object-center"
			/>
			<div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
			<div className="relative z-10 flex flex-col justify-center h-full pl-6 sm:pl-16 text-white max-w-[600px]">
				<h2 className="text-2xl sm:text-4xl font-bold mb-2 drop-shadow">
					{title}
				</h2>
				<p className="mb-4 text-base sm:text-lg">{desc}</p>
				<Link
					to={to}
					className="inline-block bg-accent text-dark font-semibold px-5 py-2 rounded-lg shadow hover:bg-secondary hover:text-white transition"
				>
					{cta}
				</Link>
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
				{carouselData.map((_, i) => (
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
	return (
		<Link
			to={to}
			className="flex flex-col items-center bg-white rounded-xl shadow hover:shadow-xl transition group p-3 sm:p-4 border border-gray-100 hover:border-primary"
		>
			<img
				src={img}
				alt={name}
				className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full mb-2 border-2 border-accent group-hover:scale-105 transition"
			/>
			<span className="text-base sm:text-lg font-medium text-dark group-hover:text-primary transition text-center">
				{name}
			</span>
		</Link>
	)
}

function ProductQuickView({ product, onClose }) {
	const [qty, setQty] = useState(1)

	// Reiniciar cantidad cuando cambia el producto
	useEffect(() => {
		setQty(1)
	}, [product])

	// Cerrar con ESC key solo si el modal está abierto
	useEffect(() => {
		if (!product) return
		const handler = e => { if (e.key === 'Escape') onClose() }
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [onClose, product])

	if (!product) return null

	// Simular stock y descripción
	const stock = 12
	const description = 'Producto seleccionado por su frescura y calidad. Ideal para tu mesa diaria. Aprovechá esta oferta exclusiva online.'

	function handleBgClick(e) {
		if (e.target === e.currentTarget) onClose()
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
			onClick={handleBgClick}
			aria-modal="true"
			role="dialog"
		>
			<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 relative flex flex-col md:flex-row overflow-hidden">
				{/* Imagen */}
				<div className="flex-1 flex items-center justify-center bg-gray-50 p-6 md:p-8">
					<img
						src={product.img}
						alt={product.name}
						className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
						draggable={false}
					/>
				</div>
				{/* Info */}
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
						<span className="font-bold text-xl text-dark">{product.name}</span>
						{product.offer && (
							<span className="bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full shadow">
								{product.offer}
							</span>
						)}
						{product.bestSeller && (
							<span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
								Más vendido
							</span>
						)}
					</div>
					<div className="text-sm text-muted mb-1">
						{product.brand} {product.weight && `· ${product.weight}`}
					</div>
					<div className="text-primary font-bold text-2xl mb-2">
						${product.price}
					</div>
					<div className="text-gray-600 text-sm mb-4">{description}</div>
					<div className="flex items-center gap-3 mb-4">
						<span className={`text-xs font-medium ${stock > 5 ? 'text-secondary' : 'text-red-500'}`}>
							{stock > 5 ? 'En stock' : 'Últimas unidades'}
						</span>
						<span className="text-xs text-gray-400">|</span>
						<span className="text-xs text-gray-500">SKU: 123456</span>
					</div>
					<div className="flex items-center gap-2 mb-6">
						<label htmlFor="qty" className="text-sm text-gray-700">
							Cantidad:
						</label>
						<input
							id="qty"
							type="number"
							min={1}
							max={stock}
							value={qty}
							onChange={e => setQty(Math.max(1, Math.min(stock, Number(e.target.value))))}
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

export default function HomePage() {
	const [quickView, setQuickView] = useState(null)
	return (
		<div className="w-full flex flex-col items-center">
			{/* Carousel */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6">
				<Carousel />
			</div>

			{/* Categorías */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6 mb-12">
				<h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-dark">
					Categorías populares
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
					{categories.map(cat => (
						<CategoryCard key={cat.name} {...cat} />
					))}
				</div>
			</div>

			{/* Promociones destacadas */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6 mb-12">
				<h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-dark">
					Promociones destacadas
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{promos.map(promo => (
						<div
							key={promo.title}
							className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden flex flex-col"
						>
							<img
								src={promo.img}
								alt={promo.title}
								className="w-full h-40 object-cover object-center"
							/>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-lg sm:text-xl font-bold mb-2 text-primary">
									{promo.title}
								</h3>
								<p className="text-gray-700 text-base sm:text-lg mb-4 flex-1">
									{promo.desc}
								</p>
								<Link
									to={promo.to}
									className="inline-block bg-accent text-dark font-semibold px-4 py-2 rounded-lg shadow hover:bg-secondary hover:text-white transition"
								>
									{promo.cta}
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Productos destacados */}
			<div className="w-full max-w-[1400px] px-2 sm:px-6 mb-16">
				<h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-dark">
					Productos destacados
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-6 auto-rows-fr">
					{destacados.map(prod => (
						<div key={prod.name} className="flex h-full min-h-[100%]">
							<ProductCard {...prod} onQuickView={setQuickView} />
						</div>
					))}
				</div>
			</div>
			<ProductQuickView product={quickView} onClose={() => setQuickView(null)} />
		</div>
	)
}
