<div align="center">

# Supermercado — Frontend

**Interfaz de usuario para e-commerce de supermercado — React + Vite**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-222?style=flat-square&logo=githubpages)](https://tomipro.github.io/tpo-supermercado-frontend/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Ver demo →](https://tomipro.github.io/tpo-supermercado-frontend/) · [API Backend](https://github.com/tomipro/tpo-supermercado-api) · [Reportar un bug](https://github.com/tomipro/tpo-supermercado-frontend/issues)

</div>

---

## Descripción

Interfaz web para el sistema de supermercado online, desarrollada como Trabajo Práctico Obligatorio para la materia *Aplicaciones Interactivas* en la **UADE** (Grupo 04).

Consume la [REST API](https://github.com/tomipro/tpo-supermercado-api) del mismo proyecto e implementa el flujo completo de compra: navegación y filtrado de productos, gestión del carrito, checkout y consulta del historial de órdenes.

> Calificación obtenida: **10/10**

---

## Funcionalidades

| Vista / Módulo | Descripción |
|---|---|
| Autenticación | Registro, login y manejo de sesión con JWT almacenado en cliente |
| Catálogo de productos | Listado con búsqueda y filtros por nombre, marca, categoría y precio |
| Carrito | Agregar, modificar cantidad y eliminar productos; resumen de compra en tiempo real |
| Checkout | Selección entre envío a domicilio o retiro en tienda |
| Historial de órdenes | Consulta de órdenes pasadas con detalle de ítems y totales |
| Perfil de usuario | Edición de datos personales y gestión de direcciones |
| Panel de administración | Gestión de usuarios, categorías y órdenes (solo rol ADMIN) |

---

## Stack tecnológico

- **React 18** — librería de UI basada en componentes
- **Vite** — bundler y dev server con HMR
- **Tailwind CSS** — estilos utilitarios
- **React Router** — navegación SPA
- **GitHub Actions** — deploy automático a GitHub Pages

---

## Estructura del proyecto

```
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes reutilizables (Navbar, Cards, Modals...)
├── pages/           # Vistas principales de la aplicación
├── context/         # Estado global (autenticación, carrito)
├── services/        # Llamadas a la API REST
├── hooks/           # Custom hooks
└── App.jsx          # Configuración de rutas
```

---

## Instalación

### Pre-requisitos

- Node.js 18+
- La [API backend](https://github.com/tomipro/tpo-supermercado-api) corriendo en `localhost:8080`

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tomipro/tpo-supermercado-frontend.git
cd tpo-supermercado-frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

### Build para producción

```bash
npm run build
```

---

## Despliegue

El proyecto se despliega automáticamente a **GitHub Pages** mediante un workflow de GitHub Actions cada vez que se hace push a `main`.

Demo en vivo: [tomipro.github.io/tpo-supermercado-frontend](https://tomipro.github.io/tpo-supermercado-frontend/)

---

## Equipo — Grupo 04

Desarrollado por estudiantes de **Ingeniería en Informática** en la **UADE**.

| Integrante | GitHub |
|---|---|
| Tomás Prodan | [@tomipro](https://github.com/tomipro) |
| Tiago Altamirano | [@tiagoaltamirano](https://github.com/tiagoaltamirano) |
| Bautista Daneri | [@Bauti-Daneri](https://github.com/Bauti-Daneri) |

---

## Repositorios relacionados

- **Backend:** [tpo-supermercado-api](https://github.com/tomipro/tpo-supermercado-api) — REST API en Java + Spring Boot
