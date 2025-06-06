import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get('tipo');

    let query = `
      SELECT 
        h.id,
        p.nombre AS producto,
        u.nombre AS usuario,
        h.tipo_movimiento,
        h.cantidad,
        h.fecha
      FROM historial h
      JOIN productos p ON h.producto_id = p.id
      JOIN usuarios u ON h.usuario_id = u.id
    `;

    const params = [];

    if (tipo === 'entrada' || tipo === 'salida') {
      query += ' WHERE h.tipo_movimiento = ?';
      params.push(tipo);
    }

    query += ' ORDER BY h.fecha DESC';

    const [rows] = await pool.query(query, params);
    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}