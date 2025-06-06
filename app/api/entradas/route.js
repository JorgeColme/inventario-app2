export async function POST(req) {
  const { producto_id, usuario_id, cantidad } = await req.json();

  const [[producto]] = await pool.query('SELECT cantidad, estatus FROM productos WHERE id = ?', [producto_id]);
  if (!producto || producto.estatus !== 'activo') {
    return Response.json({ error: 'Producto inactivo' }, { status: 400 });
  }

  await pool.query('UPDATE productos SET cantidad = cantidad + ? WHERE id = ?', [cantidad, producto_id]);
  await pool.query(
    'INSERT INTO entradas (producto_id, usuario_id, cantidad, fecha) VALUES (?, ?, ?, NOW())',
    [producto_id, usuario_id, cantidad]
  );

  return Response.json({ message: 'Entrada registrada' });
}

