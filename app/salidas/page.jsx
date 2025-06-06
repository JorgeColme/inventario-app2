'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function SalidasPage() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [newCantidad, setNewCantidad] = useState('');
  const [destino, setDestino] = useState('');
  const usuarioId = 1;

  const fetchProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos()
  }, []);

  const handleProductoChange = (e) => {
    const selectedId = e.target.value;
    const productoSeleccionado = productos.find(p => p.id == selectedId);
    setProductoId(selectedId);
    setCantidadDisponible(productoSeleccionado?.cantidad || 0);
    setNewCantidad('');
  };

  const handleCantidadChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      const numValue = value === '' ? 0 : parseInt(value);

      if (numValue <= cantidadDisponible) {
        setNewCantidad(value);
      } else {
        toast.error(`No hay suficiente stock. Máximo disponible: ${cantidadDisponible}`);
        setNewCantidad(cantidadDisponible.toString());
      }
    }
  };

  const editQuantity = async (id, nuevoCantidad, newCantidad) => {
    await fetch('/api/salidas', {
      method: 'PUT',
      body: JSON.stringify({ id, cantidad: nuevoCantidad, currentCantidad: newCantidad }),
    });
    fetchProductos()
  };

  const registrarSalida = async () => {
const user = localStorage.getItem("user");

    if (!productoId) {
      return alert('Seleccione un producto');
    }

    if (!newCantidad || parseInt(newCantidad) <= 0) {
      return alert('Ingrese una cantidad válida');
    }

    if (parseInt(newCantidad) > cantidadDisponible) {
      return alert('La cantidad excede el stock disponible');
    }

    try {
      editQuantity(productoId, cantidadDisponible - newCantidad, newCantidad, user.id)

      setProductoId('');
      setNewCantidad('');
      setCantidadDisponible(0);
      alert("Cantidad modificada correctamente!!")
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Salida de Productos</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Producto</label>
          <select
            value={productoId}
            onChange={handleProductoChange}
            className="border p-2 w-full rounded"
          >
            <option className="text-black" value="">Selecciona un producto</option>
            {productos
              .filter(p => p.estatus === 'activo')
              .map(p => (
                <option className="text-black" key={p.id} value={p.id}>
                  {p.nombre} (Disponibles: {p.cantidad})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <input
            type="text"
            value={newCantidad}
            onChange={handleCantidadChange}
            className="border p-2 w-full rounded"
            placeholder="Ingrese cantidad"
            disabled={!productoId}
          />
          {productoId && (
            <p className="text-xs text-gray-500 mt-1">
              Máximo disponible: {cantidadDisponible}
            </p>
          )}
        </div>
        <button
          onClick={registrarSalida}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
        >
          Registrar Salida
        </button>
      </div>
    </div>
  );
}