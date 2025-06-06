'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) return router.push('/login');
    setUser(JSON.parse(u));
  }, []);

  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Bienvenido {user.nombre}</h1>
      <ul className="space-y-2">
        <li><Link href="/productos" className="text-blue-600">Ver Inventario</Link></li>
        {user?.rol_id !== 1 &&
          <li><Link href="/salidas" className="text-blue-600">Salida de productos</Link></li>
        }
        {user?.rol_id === 1 &&
          <li><Link href="/historial" className="text-blue-600">Ver historial</Link></li>
        }
        <br />
        <br />
        <br />
        <li>
          <Link
            href="/login"
            onClick={() => {
              localStorage.removeItem("user");
            }}
            className="text-blue-600"
          >
            Cerrar sesión
          </Link>
        </li>

      </ul>
    </div>
  );
}
