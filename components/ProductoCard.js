import { useState } from 'react';

export default function ProductoCard({ 
  producto, 
  onEntrada, 
  onSalida, 
  onToggleStatus,
  showActions = true,
  showStatus = true
}) {
  const [openEntrada, setOpenEntrada] = useState(false);
  const [openSalida, setOpenSalida] = useState(false);
  const [cantidad, setCantidad] = useState('');
  const [destino, setDestino] = useState('');
  const [error, setError] = useState('');

  const handleEntrada = () => {
    if (!cantidad || isNaN(cantidad)) {
      setError('Ingrese una cantidad válida');
      return;
    }
    
    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    onEntrada(producto.id, cantidadNum);
    setOpenEntrada(false);
    setCantidad('');
    setError('');
  };

  const handleSalida = () => {
    if (!cantidad || isNaN(cantidad)) {
      setError('Ingrese una cantidad válida');
      return;
    }
    
    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (!destino) {
      setError('Ingrese un destino');
      return;
    }

    onSalida(producto.id, cantidadNum, destino);
    setOpenSalida(false);
    setCantidad('');
    setDestino('');
    setError('');
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
          {showStatus && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {producto.activo ? 'Activo' : 'Inactivo'}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{producto.descripcion}</p>
        <div className="mt-2">
          <p className="text-gray-700">Cantidad: <span className="font-semibold">{producto.cantidad}</span></p>
          <p className="text-gray-700">Precio unitario: <span className="font-semibold">${producto.precio_unitario}</span></p>
        </div>

        {showActions && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => setOpenEntrada(true)}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Entrada
            </button>
            
            <button
              onClick={() => setOpenSalida(true)}
              disabled={!producto.activo}
              className={`flex items-center px-3 py-1 rounded text-sm ${
                producto.activo 
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Salida
            </button>
            
            <button
              onClick={() => onToggleStatus(producto.id, !producto.activo)}
              className={`flex items-center px-3 py-1 rounded text-sm ${
                producto.activo 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {producto.activo ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Desactivar
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Activar
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal para entrada */}
      {openEntrada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Registrar entrada de inventario</h3>
            </div>
            <div className="p-4">
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cantidad"
                autoFocus
              />
              {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button 
                onClick={() => setOpenEntrada(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button 
                onClick={handleEntrada}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para salida */}
      {openSalida && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Registrar salida de inventario</h3>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cantidad"
                autoFocus
              />
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Destino"
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button 
                onClick={() => setOpenSalida(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSalida}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}