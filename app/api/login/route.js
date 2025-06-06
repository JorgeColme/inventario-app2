import pool from '@/lib/db';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, rol_id FROM usuarios WHERE email = ? AND contraseña = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return Response.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    return Response.json(rows[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
