-- Script de inicialización de base de datos para MediCore
-- Ejecutado automáticamente por Docker al crear el contenedor

-- Tabla de usuarios con RBAC
CREATE TABLE IF NOT EXISTS usuarios (
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

-- Tabla de sesiones para refresh tokens
CREATE TABLE IF NOT EXISTS sesiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_documento ON usuarios(documento);
CREATE INDEX IF NOT EXISTS idx_sesiones_refresh_token ON sesiones(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario_id ON sesiones(usuario_id);

-- Usuario administrador por defecto (password: admin123)
-- Hash generado con bcrypt, salt rounds = 12
INSERT INTO usuarios (username, password_hash, rol, nombre_completo, documento, email)
VALUES (
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7Km',
    'admin',
    'Administrador del Sistema',
    '0000000000',
    'admin@medicore.local'
)
ON CONFLICT (username) DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con control de acceso basado en roles (RBAC)';
COMMENT ON TABLE sesiones IS 'Tabla de sesiones activas con refresh tokens para autenticación JWT';
COMMENT ON COLUMN usuarios.password_hash IS 'Hash de contraseña generado con bcrypt (salt rounds >= 12)';
COMMENT ON COLUMN sesiones.refresh_token IS 'Refresh token JWT con vida de 7 días';
