import pool from '@/lib/db';



export async function GET() {
  const [rows] = await pool.query('SELECT * FROM productos');
  console.log("Response.json(rows) : ", Response.json(rows))
  return Response.json(rows);
}

export async function POST(req) {
  const { nombre, descripcion, cantidad, precio_unitario } = await req.json();
  await pool.query(
    'INSERT INTO productos (nombre, descripcion, cantidad, precio_unitario, estatus) VALUES (?, ?, 0, ?, "activo")',
    [nombre, descripcion, cantidad, precio_unitario]
  );
  return Response.json({ message: 'Producto agregado' });
}

export async function PUT(req) {
  const { id, estatus } = await req.json();
  await pool.query('UPDATE productos SET estatus = ? WHERE id = ?', [estatus, id]);

  return Response.json({ message: 'Producto actualizado' });

}

export async function PATCH(req) {
  const { id, cantidad, currentCantidad, userId } = await req.json();
  
  
  if (isNaN(cantidad)) {
    return Response.json(
      { error: 'La cantidad debe ser un número' },
      { status: 400 }
    )
  }

  await pool.query(
    'UPDATE productos SET cantidad = ? WHERE id = ?',
    [cantidad, id]
  );

  await pool.query(
    'INSERT INTO historial (producto_id, usuario_id, tipo_movimiento, cantidad) VALUES (?, ?, ?, ?)',
    [id, userId, 'entrada', currentCantidad]
  );

  return Response.json({
    success: true,
    message: 'Cantidad actualizada',
    id,
    cantidad
  });
}