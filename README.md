# 📦 inventario-app2

Aplicación web para gestión de inventario con historial de movimientos (entradas y salidas), desarrollada con **Next.js** y **MySQL**. Ideal para registrar productos, controlar stock y rastrear cambios hechos por distintos usuarios.

---

## ✨ Características principales

- ✅ CRUD de productos
- 🔁 Registro automático en historial al hacer entradas o salidas
- 🧑‍💻 Control de usuarios (a través de localStorage)
- 🔐 Control de roles: admin y usuario
- 📜 API RESTful con rutas de Next.js
- 🔍 Historial con `JOIN` a productos y usuarios
- ⚡ Estilo limpio y funcional (Tailwind opcional)

---

## 🛠️ Tecnologías utilizadas

- [Next.js 14+](https://nextjs.org/)
- [React 18+](https://reactjs.org/)
- [MySQL](https://www.mysql.com/)
- [Tailwind CSS](https://tailwindcss.com/) (opcional)
- Node.js 18+

---

## 🚀 Requisitos previos

Asegúrate de tener instalado:

- [Node.js (18+ recomendado)](https://nodejs.org/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)

---

## ⚙️ Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/inventario-app2.git
cd inventario-app2


npm install       # Instala las dependencias
npm run dev      # Ejecuta el servidor en modo desarrollo
npm run build    # Compila para producción
npm start        # Inicia el servidor en modo producción


estructura del proyecto

inventario-app2/
├── app/                # Rutas y API handlers de Next.js
│   ├── api/
│   │   ├── productos/  # Endpoints para productos
│   │   ├── historial/  # Endpoints para historial
├── components/         # Componentes reutilizables
├── lib/
│   └── db.js           # Configuración de MySQL (pool de conexión)
├── public/             # Recursos estáticos
├── styles/             # Estilos globales
├── .env.local          # Variables de entorno (NO subir a Git)
├── README.md           # Este archivo
└── package.json
