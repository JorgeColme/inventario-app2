import jwt from 'jsonwebtoken';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import pool from './db';

export async function authenticateUser(email, password) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (rows.length === 0) return null;
  
  const user = rows[0];
  const bcrypt = require('bcryptjs');
  const passwordMatch = await bcrypt.compare(password, user.contraseña);
  
  if (!passwordMatch) return null;
  
  // Eliminamos la contraseña del objeto usuario
  const { contraseña, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, rol_id: user.rol_id },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export function setAuthCookie(token, req, res) {
  setCookie('authToken', token, {
    req,
    res,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 horas
    sameSite: 'strict',
    path: '/',
  });
}

export function removeAuthCookie(req, res) {
  deleteCookie('authToken', { req, res });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  const [rows] = await pool.query('SELECT id, nombre, email, rol_id FROM usuarios WHERE id = ?', [decoded.id]);
  return rows[0] || null;
}