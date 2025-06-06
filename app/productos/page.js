'use client';
import { useEffect, useState } from 'react';
import AddProductModal from '@/components/AddProductModal';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevaCantidad, setNuevaCantidad] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const toggleEstatus = async (id, nuevoEstatus) => {
    await fetch('/api/productos', {
      method: 'PUT',
      body: JSON.stringify({ id, estatus: nuevoEstatus }),
    });
    fetchProductos();
  };

  const addProducts = async (data) => {
    console.log("data : ", data)
    await fetch('/api/productos', {
      method: 'POST',
      body: JSON.stringify({ nombre: data.nombre, descripcion: data.descripcion, cantidad: data.cantidad, precio_unitario: data.precio }),
    });
    fetchProductos();
  };

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    addProducts(newProduct)
  };

  const handleEditar = (prod) => {
    setEditando(prod.id);
    setNuevaCantidad(prod.cantidad);
  };

  const editQuantity = async (id, nuevaCantidad, cantidad) => {
    const user = localStorage.getItem("user");
    await fetch('/api/productos', {
      method: 'PATCH',
      body: JSON.stringify({ id, cantidad: nuevaCantidad, currentCantidad: cantidad, userId: user.id }),
    });
    fetchProductos();
  };

  const handleGuardar = (id, cantidad) => {
    editQuantity(id, nuevaCantidad, cantidad);
    setEditando(null);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Inventario</h1>
      {user?.rol_id === 1 &&
        <button className='px-4 py-2 bg-blue-500 text-white rounded-lg mb-0.5' onClick={() => setIsModalOpen(true)}>Agregar Producto +</button>
      }
      <table className="min-w-full divide-y divide-gray-200">
        <thead className='text-black'>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left">Producto</th>
            <th className="px-6 py-3 text-left">Descripción</th>
            <th className="px-6 py-3 text-center">Cantidad</th>
            <th className="px-6 py-3 text-center">Estatus</th>
            <th className="px-6 py-3 text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-black">
          {productos.map((prod) => (
            <tr key={prod.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{prod.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{prod.descripcion}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {editando === prod.id ? (
                  <div className="flex items-center justify-center space-x-2">
                    <input
                      type="number"
                      value={nuevaCantidad}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || prod.cantidad;
                        if (value < prod.cantidad) {
                          alert(`No puedes reducir la cantidad. Mínimo permitido: ${prod.cantidad}`);
                          setNuevaCantidad(prod.cantidad);
                        } else {
                          setNuevaCantidad(value);
                        }
                      }}
                      className="w-20 px-2 py-1 border rounded text-center"
                      min={prod.cantidad - 1}
                    />
                    <button
                      onClick={() => handleGuardar(prod.id, prod.cantidad)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center space-x-2">
                      <span>{prod.cantidad}</span>
                      {user?.rol_id === 1 &&

                        <button
                          onClick={() => handleEditar(prod)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </button>
                      }
                    </div>
                  </>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${prod.estatus === 'activo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {prod.estatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  disabled={user?.rol_id !== 1}
                  className={`px-3 py-1 rounded ${user?.rol_id !== 1 ? 'bg-gray-100 text-gray-700 hover:bg-gary-200' : prod.estatus === 'activo'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  onClick={() => toggleEstatus(prod.id, prod.estatus === 'activo' ? 'inactivo' : 'activo')}
                >
                  {prod.estatus === 'activo' ? 'Dar de baja' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
