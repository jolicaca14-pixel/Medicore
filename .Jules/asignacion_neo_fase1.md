# Asignación para NEO - Fase 1: Backend Modular + Autenticación

## 🎯 Contexto
Jules te ha asignado la implementación del backend del sistema HealthTech PWA. Actualmente solo existe el frontend (React + Vite). Debes crear todo el backend desde cero siguiendo la arquitectura definida en `.Jules/Documentacion/architecture_design.md`.

## 📋 Tareas Asignadas

### 1. Estructura Modular del Backend (P0 - CRÍTICO)

Crear la siguiente estructura de carpetas:

```
backend/
├── src/
│   ├── modulos/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   └── types/
│   │   ├── pacientes/
│   │   ├── historias-clinicas/
│   │   ├── agenda/
│   │   └── recetas/
│   ├── config/
│   ├── database/
│   └── server.ts
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── start.bat
```

### 2. Setup Inicial

**package.json** debe incluir:
- express
- typescript
- @types/node, @types/express
- pg (PostgreSQL client)
- jsonwebtoken, @types/jsonwebtoken
- bcrypt, @types/bcrypt
- dotenv
- cors

**tsconfig.json**: Configuración estricta de TypeScript

**docker-compose.yml**: PostgreSQL 14+ con volumen persistente

**start.bat**: Script para Windows que:
1. Levanta Docker (PostgreSQL)
2. Instala dependencias (`npm install`)
3. Ejecuta migraciones
4. Inicia servidor (`npm run dev`)

### 3. Módulo de Autenticación (P0 - CRÍTICO)

**Endpoints a implementar**:
- `POST /api/auth/login` - Login con usuario/contraseña
- `POST /api/auth/refresh` - Renovar AccessToken con RefreshToken
- `POST /api/auth/logout` - Cerrar sesión

**Seguridad**:
- JWT con AccessToken (15 min) y RefreshToken (7 días)
- RefreshToken en HttpOnly cookie
- Contraseñas con bcrypt (salt rounds >= 12)
- Middleware RBAC para validar roles

**Roles soportados**:
- `admin` - Administrador del sistema
- `professional` - Médico/Enfermera/Psicólogo
- `secretary` - Personal administrativo

### 4. Base de Datos Inicial

**Tablas a crear**:

```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'professional', 'secretary')),
    nombre_completo VARCHAR(255) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_sesiones_refresh_token ON sesiones(refresh_token);
```

## ✅ Criterios de Éxito

1. ✅ Estructura de carpetas modular creada
2. ✅ Docker levanta PostgreSQL sin intervención manual
3. ✅ `start.bat` funciona en un solo clic
4. ✅ TypeScript compila sin errores
5. ✅ Endpoints de autenticación funcionan correctamente
6. ✅ RBAC implementado y validado
7. ✅ Contraseñas encriptadas con bcrypt

## 📊 Reporte Esperado

Al finalizar, debes reportar en `.jules/central_log.md`:

```markdown
## [FECHA-HORA] - AGENTE: NEO
**Acción Realizada**: Implementación de estructura backend modular + módulo de autenticación
**Archivos Modificados**: 
- backend/src/modulos/auth/... (lista completa)
- backend/package.json
- backend/docker-compose.yml
- etc.
**Dificultades/Bloqueos**: [Si hubo alguna]
**Siguiente Agente Sugerido**: [Trinity para conectar frontend con API de auth / Morpheus para auditoría de seguridad]
```

## 🚀 Comienza Ahora

Lee tu archivo de instrucciones en `.Jules/neo_instructions.md` y procede con la implementación.

**Recuerda**: 
- Tipado estricto de TypeScript
- No dejar credenciales en texto plano (usar `.env`)
- Seguir principio de separación de responsabilidades (Controladores → Servicios)
- Validar integridad referencial en PostgreSQL

---

**Asignado por**: Jules
**Fecha**: 2026-01-22 22:08
**Prioridad**: P0 - CRÍTICO
