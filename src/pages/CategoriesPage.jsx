import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/1046/1046857.png";

export default function CategoriesPage() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchCategorias() {
			setLoading(true);
			try {
				const res = await fetch("http://localhost:4040/categorias");
				const data = await res.json();
				setCategories(Array.isArray(data.content) ? data.content : []);
			} catch {
				setCategories([]);
			} finally {
				setLoading(false);
			}
		}
		fetchCategorias();
	}, []);

	return (
		<div className="max-w-5xl mx-auto mt-10 px-2 sm:px-6">
			<h1 className="text-3xl font-bold mb-8 text-primary">Categorías</h1>
			{loading ? (
				<div className="text-gray-500">Cargando categorías...</div>
			) : categories.length === 0 ? (
				<div className="text-gray-500">No hay categorías disponibles.</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
					{categories.map(cat => (
						<Link
							key={cat.id}
							to={`/categorias?cat=${cat.id}`}
							className="flex flex-col items-center bg-white rounded-xl shadow hover:shadow-xl transition group p-4 border border-gray-100 hover:border-primary"
						>
							<img
								src={
									(cat.productos && cat.productos[0]?.imagenes?.[0]?.imagen)
									|| FALLBACK_IMG
								}
								alt={cat.nombre}
								className="w-20 h-20 object-cover rounded-full mb-2 border-2 border-accent group-hover:scale-105 transition"
							/>
							<span className="text-lg font-medium text-dark group-hover:text-primary transition text-center">
								{cat.nombre}
							</span>
							{cat.subcategorias && cat.subcategorias.length > 0 && (
								<div className="mt-2 text-xs text-muted text-center">
									Subcategorías:{" "}
									{cat.subcategorias.map(sub => sub.nombre).join(", ")}
								</div>
							)}
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
