import pool from '@/lib/db';

export async function POST(req) {
  const { producto_id, usuario_id, cantidad, destino } = await req.json();

  const [[producto]] = await pool.query('SELECT cantidad, estatus FROM productos WHERE id = ?', [producto_id]);
  if (!producto || producto.estatus !== 'activo') {
    return Response.json({ error: 'Producto inactivo' }, { status: 400 });
  }

  if (producto.cantidad < cantidad) {
    return Response.json({ error: 'No hay suficiente stock' }, { status: 400 });
  }

  await pool.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?', [cantidad, producto_id]);
  await pool.query(
    'INSERT INTO salidas (producto_id, usuario_id, cantidad, destino, fecha) VALUES (?, ?, ?, ?, NOW())',
    [producto_id, usuario_id, cantidad, destino]
  );

  return Response.json({ message: 'Salida registrada' });
}


export async function PUT(req) {
  const { id, cantidad, currentCantidad, userId } = await req.json();
  try {
    if (!id || isNaN(cantidad) || cantidad < 0) {
      return new Response(
        JSON.stringify({ error: 'Datos inválidos. Se requiere ID y cantidad debe ser número positivo' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [producto] = await pool.query('SELECT cantidad FROM productos WHERE id = ?', [id]);
    if (producto.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Producto no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await pool.query('UPDATE productos SET cantidad = ? WHERE id = ?', [cantidad, id]);
    await pool.query(
      'INSERT INTO historial (producto_id, usuario_id, tipo_movimiento, cantidad) VALUES (?, ?, ?, ?)',
      [id, userId, 'salida', currentCantidad]
    );

    const [updatedProduct] = await pool.query(
      'SELECT id, nombre, cantidad FROM productos WHERE id = ?',
      [id]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cantidad actualizada correctamente',
        producto: updatedProduct[0]
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en PUT /api/productos/cantidad:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}