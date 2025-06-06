'use client';
import { useEffect, useState } from 'react';

export default function HistorialPage() {
  const [tipo, setTipo] = useState('entrada');
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    fetch(`/api/historial?tipo=${tipo}`)
      .then(res => res.json())
      .then(setMovimientos);
  }, [tipo]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de {tipo === 'entrada' ? 'Entradas' : 'Salidas'}</h1>
      <select value={tipo} onChange={e => setTipo(e.target.value)} className="border p-2 mb-4">
        <option className="text-black" value="entrada">Entradas</option>
        <option className="text-black" value="salida">Salidas</option>
      </select>

      <table className="w-full border">
        <thead className='text-black'>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Producto</th>
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Cantidad</th>
            <th className="p-2 border">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(mov => (
            <tr key={mov.id}>
              <td className="p-2 border">{mov.id}</td>
              <td className="p-2 border">{mov.producto}</td>
              <td className="p-2 border">{mov.usuario}</td>
              <td className="p-2 border">{mov.cantidad}</td>
              <td className="p-2 border">{mov.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
