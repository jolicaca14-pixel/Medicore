# Plan de Implementación - Fase 1: Estructura y Fundamentos

## Objetivo
Establecer la base técnica del proyecto (Scaffolding) configurando el repositorio con una arquitectura **PERN** (PostgreSQL, Express, React, Node.js), habilitando soporte TypeScript y preparando la estructura para los módulos definidos (Auth, HCE, RIPS).

## Revisión de Usuario Requerida
> [!IMPORTANT]
> Se utilizará **Docker Compose** para orquestar la base de datos PostgreSQL localmente. Asegúrese de tener Docker Desktop instalado y corriendo.
> El frontend se inicializará con **Vite** para máxima velocidad.

## Cambios Propuestos

### Infraestructura (Raíz)
#### [NUEVO] [docker-compose.yml](file:///C:/Users/User/.gemini/antigravity/scratch/zodiac_rpg/src/Cartas Nandeck/Aplicacion Pacientes/docker-compose.yml)
- Definición del servicio `postgres` con persistencia de datos.

### Backend (`/server`)
#### [NUEVO] Estructura de Carpetas REST API
- Inicialización de proyecto Node.js + TypeScript (`package.json`, `tsconfig.json`).
- **Dependencias Clave**: `puppeteer` (Generación PDF), `nodemailer` (Envío correos).
- Configuración de Express y conexión a DB (`src/app.ts`, `src/config/db.ts`).
- Creación de estructura modular:
    - `/src/modulos/auth`
    - `/src/modulos/pacientes`
    - `/src/modulos/historias-clinicas`
    - `/src/modulos/diagnosticos` (Laboratorio e Imagenología)
    - `/src/modulos/recetas`
    - `/src/modulos/facturacion` (Tarifarios, Cuentas de Cobro)
    - `/src/modulos/rrhh` (Contratos, Nómina, OPS)
    - `/src/modulos/rips`
    - `/src/modulos/reportes`
    - `/src/modulos/notificaciones` (Email Service)
- **Nota**: Para esta fase, los archivos se guardarán en sistema de archivos local (`/uploads`). En prod se usaría S3.

### Frontend (`/client`)
#### [NUEVO] PWA React + Vite
- Inicialización con `npm create vite@latest`.
- Configuración de TailwindCSS (si aplica) o CSS Modules minimalistas (según guías UI).
- Configuración de Manifest y Service Worker básico para PWA.
- Estructura de carpetas:
    - `/src/components` (UI Kit Minimalista)
    - `/src/pages` (Rutas)
    - `/src/context` (Estado Global)

## Plan de Verificación

### Verificación Automatizada
1.  **Backend Health Check**:
    - Ejecutar `npm run dev` en server.
    - curl a `http://localhost:3000/api/health` -> Debe retornar 200 OK.
2.  **Conexión BD**:
    - Verificar logs de inicio del backend: "Conectado a PostgreSQL exitosamente".
3.  **Frontend Build**:
    - Ejecutar `npm run build` en client -> Debe generar carpeta `dist` sin errores.

### Verificación Manual
1.  Abrir navegador en `http://localhost:5173` (Frontend).
2.  Verificar carga rápida y ausencia de errores en consola.
3.  Verificar que el Service Worker esté registrado (Tab Application en DevTools).
