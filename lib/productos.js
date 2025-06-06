import pool from './db';

export async function getProductos(activo = null) {
  let query = 'SELECT * FROM productos';
  if (activo !== null) {
    query += ' WHERE activo = ?';
    const [rows] = await pool.query(query, [activo ? 1 : 0]);
    return rows;
  }
  const [rows] = await pool.query(query);
  return rows;
}

export async function getProductoById(id) {
  const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  return rows[0];
}

export async function createProducto(nombre, descripcion, precio_unitario) {
  const [result] = await pool.query(
    'INSERT INTO productos (nombre, descripcion, precio_unitario, cantidad) VALUES (?, ?, ?, 0)',
    [nombre, descripcion, precio_unitario]
  );
  return result.insertId;
}

export async function updateProductoCantidad(id, cantidad) {
  const [result] = await pool.query(
    'UPDATE productos SET cantidad = ? WHERE id = ?',
    [cantidad, id]
  );
  return result.affectedRows;
}

export async function toggleProductoStatus(id, activo) {
  const [result] = await pool.query(
    'UPDATE productos SET activo = ? WHERE id = ?',
    [activo ? 1 : 0, id]
  );
  return result.affectedRows;
}

export async function registrarEntrada(producto_id, usuario_id, cantidad) {
  const [result] = await pool.query(
    'INSERT INTO entradas (producto_id, usuario_id, cantidad) VALUES (?, ?, ?)',
    [producto_id, usuario_id, cantidad]
  );
  return result.insertId;
}

export async function registrarSalida(producto_id, usuario_id, cantidad, destino) {
  const [result] = await pool.query(
    'INSERT INTO salidas (producto_id, usuario_id, cantidad, destino) VALUES (?, ?, ?, ?)',
    [producto_id, usuario_id, cantidad, destino]
  );
  return result.insertId;
}

export async function getMovimientos(filtro = null) {
  let query = `
    SELECT 
      e.id, 
      p.nombre as producto, 
      u.nombre as usuario, 
      e.cantidad, 
      e.fecha_entrada as fecha, 
      'entrada' as tipo,
      NULL as destino
    FROM entradas e
    JOIN productos p ON e.producto_id = p.id
    JOIN usuarios u ON e.usuario_id = u.id
    
    UNION ALL
    
    SELECT 
      s.id, 
      p.nombre as producto, 
      u.nombre as usuario, 
      s.cantidad, 
      s.fecha_salida as fecha, 
      'salida' as tipo,
      s.destino
    FROM salidas s
    JOIN productos p ON s.producto_id = p.id
    JOIN usuarios u ON s.usuario_id = u.id
  `;

  if (filtro === 'entrada' || filtro === 'salida') {
    query += ` WHERE tipo = '${filtro}'`;
  }

  query += ' ORDER BY fecha DESC';

  const [rows] = await pool.query(query);
  return rows;
}