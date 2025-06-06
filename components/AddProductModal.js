// components/AddProductModal.js
import { useState } from "react";

export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
    const [formData, setFormData] = useState({
        nombre: "",          // name → nombre
        descripcion: "",     // description → descripcion
        precio: "",          // price → precio
        cantidad: 0,         // quantity → cantidad (valor por defecto)
        fechaCreacion: new Date().toISOString(), // createdAt → fechaCreacion
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProduct({
            ...formData,
            cantidad: 0, // Aseguramos que siempre sea 0 al crear
            fechaCreacion: new Date().toISOString(), // Fecha actualizada
        });
        // Limpiar formulario
        setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            cantidad: 0,
            fechaCreacion: new Date().toISOString()
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Campo: Nombre */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="nombre">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Campo: Descripción */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="descripcion">
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                required
                            />
                        </div>

                        {/* Campo: Precio */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="precio">
                                Precio ($)
                            </label>
                            <input
                                type="number"
                                id="precio"
                                name="precio"
                                value={formData.precio}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}