'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function EntradasPage() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const usuarioId = 1; // Cambiar según login real

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(setProductos);
  }, []);

  const registrarEntrada = async () => {
    const res = await fetch('/api/entradas', {
      method: 'POST',
      body: JSON.stringify({ producto_id: parseInt(productoId), usuario_id: usuarioId, cantidad: parseInt(cantidad) }),
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.error || 'Error');
    toast.success(data.message);
    setCantidad(0);
    setProductoId('');
  };

  console.log("productos : ", productos)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Entrada de Productos</h1>
      <select value={productoId} onChange={e => setProductoId(e.target.value.id)} className="border p-2 mb-2 w-full">
        <option value="">Selecciona un producto</option>
        {productos.filter(p => p.estatus === 'activo').map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>
      <input
        type="number"
        value={cantidad}
        onChange={e => setCantidad(e.target.value)}
        className="border p-2 mb-2 w-full"
        placeholder="Cantidad"
      />
      <button onClick={registrarEntrada} className="bg-green-600 text-white px-4 py-2 rounded">Registrar Entrada</button>
    </div>
  );
}
