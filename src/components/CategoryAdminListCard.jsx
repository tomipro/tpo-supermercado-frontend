import React from "react";

export default function CategoryAdminListCard({
  categoria,
  onEdit,
  onDelete,
}) {
  return (
    <div className="border rounded p-4 mb-4 bg-white shadow flex flex-col gap-2">
      <h3 className="text-lg font-bold">{categoria.nombre}</h3>
      <div>
        <span className="font-semibold">Categoría padre: </span>
        {categoria.parentNombre ? (
          categoria.parentNombre
        ) : (
          <span className="text-gray-500">No tiene</span>
        )}
      </div>
      <div>
        <span className="font-semibold">Subcategorías: </span>
        {categoria.subcategorias && categoria.subcategorias.length > 0 ? (
          <ul className="list-disc ml-6">
            {categoria.subcategorias.map((sub) => (
              <li key={sub.id}>{sub.nombre}</li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500">No tiene</span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-primary text-white px-3 py-1 rounded font-semibold"
          onClick={() => onEdit(categoria)}
        >
          Modificar
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded font-semibold"
          onClick={() => onDelete(categoria)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}