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

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo VARCHAR(255) NOT NULL,
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    tipo_identificacion VARCHAR(10) DEFAULT 'CC',
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(1) CHECK (genero IN ('M', 'F', 'O')),
    email VARCHAR(255),
    telefono VARCHAR(20),
    tipo_aseguradora VARCHAR(50),
    alergias TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para pacientes
CREATE INDEX IF NOT EXISTS idx_pacientes_identificacion ON pacientes(identificacion);
CREATE INDEX IF NOT EXISTS idx_pacientes_nombre ON pacientes(nombre_completo);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
    profesional_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    estado VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (estado IN ('SCHEDULED', 'WAITING', 'COMPLETED', 'CANCELLED')),
    procedimientos JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para citas
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_citas_profesional ON citas(profesional_id);

-- Usuario administrador por defecto (password: admin123)
-- Hash generado con bcrypt, salt rounds = 12
INSERT INTO usuarios (username, password_hash, rol, nombre_completo, documento, email)
VALUES (
    'admin',
    '$2b$12$I2kaELFnsRgqfcvJqfoTmOD27udBg29mNj2YSX68P/RPIzkq0mKIG',
    'admin',
    'Administrador del Sistema',
    '80123456',
    'admin@medicore.local'
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO usuarios (username, password_hash, rol, nombre_completo, documento, email)
VALUES
('doc_elena', '$2b$12$FwOf7Ye0BbChZDSr60kLKe8Uz84wFvwj.UkRmAlUJ0gb943kbz/BG', 'professional', 'Dra. Elena Foster', '1098765432', 'elena@medicore.local'),
('doc_house', '$2b$12$5iImxJhRLDZTfQ9rN4Bm6.xEv6jQxohwRRvk75H4GVS39XVsipG4G', 'professional', 'Dr. Gregory House', '12345678', 'house@medicore.local'),
('pedro_psi', '$2b$12$6dU02Gfc35Qc6ysUaLu3I.ieHgWJnsat9T.eIoRJucPqfhfoLTQ1G', 'professional', 'Lic. Pedro Psi', '87654321', 'pedro@medicore.local'),
('carla_nutri', '$2b$12$B2m42K8e9ooewNz/9ClOIu2kXQ0AmNrRdVq3lcMfVl3BbdkR8rtmq', 'professional', 'Nutr. Carla Dieta', '13572468', 'carla@medicore.local'),
('sandra_sec', '$2b$12$UVkmyT07A0DKiAzPt4kR5Oqo/lFGdZkDQk2RW4W7bnT42nxeRY.9e', 'secretary', 'Sandra Secretaria', '24681357', 'sandra@medicore.local'),
('contador_demo', '$2b$12$N.PiYmUEciQQq5LIf1I1/uw4RxL1W89P8rAryvAGTagY9X77syr06', 'admin', 'Contador Demo', '11224455', 'contador@medicore.local'),
('gerente_demo', '$2b$12$7y3AxU9oavnN9BE1VCQRXOSY1x6ENpfUGOOceBOfx3dKs36I3dA8y', 'admin', 'Victoria Gerente', '55442211', 'gerente@medicore.local')
ON CONFLICT (username) DO NOTHING;

-- Mock Patients para desarrollo
INSERT INTO pacientes (nombre_completo, identificacion, fecha_nacimiento, genero, tipo_aseguradora, alergias)
VALUES
('Elena Nito del Bosque', '1098765432', '1985-05-15', 'F', 'Sura EPS', 'Penicilina'),
('Armando Casas', '12345678', '1970-12-01', 'M', 'Sanitas', NULL),
('Aquiles Brinco', '87654321', '1992-03-24', 'M', 'Compensar', 'Aspirina')
ON CONFLICT (identificacion) DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con control de acceso basado en roles (RBAC)';
COMMENT ON TABLE sesiones IS 'Tabla de sesiones activas con refresh tokens para autenticación JWT';
COMMENT ON COLUMN usuarios.password_hash IS 'Hash de contraseña generado con bcrypt (salt rounds >= 12)';
COMMENT ON COLUMN sesiones.refresh_token IS 'Refresh token JWT con vida de 7 días';

-- Tabla de historias clínicas (HCE)
CREATE TABLE IF NOT EXISTS historias_clinicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
    profesional_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    tipo_registro VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_finalizacion TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'DRAFT' CHECK (estado IN ('DRAFT', 'FINALIZED')),
    motivo_consulta TEXT,
    enfermedad_actual TEXT,
    antecedentes TEXT,
    diagnosticos JSONB DEFAULT '[]',
    plan_manejo TEXT,
    prescripciones JSONB DEFAULT '[]',
    procedimientos JSONB DEFAULT '[]',
    datos_dinamicos JSONB DEFAULT '{}',
    notas_aclaratorias JSONB DEFAULT '[]',
    firma_hash VARCHAR(255),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para historias clínicas
CREATE INDEX IF NOT EXISTS idx_hce_paciente ON historias_clinicas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_hce_profesional ON historias_clinicas(profesional_id);
CREATE INDEX IF NOT EXISTS idx_hce_fecha ON historias_clinicas(fecha_creacion);

COMMENT ON TABLE historias_clinicas IS 'Almacén central de Historias Clínicas Electrónicas (HCE)';

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
    profesional_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    cita_id UUID REFERENCES citas(id) ON DELETE SET NULL,
    fecha_emision TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(20) DEFAULT 'PENDING' CHECK (estado IN ('PENDING', 'PAID', 'CANCELLED', 'OVERDUE')),
    subtotal DECIMAL(15, 2) NOT NULL,
    impuestos DECIMAL(15, 2) DEFAULT 0,
    descuentos DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,
    saldo_pendiente DECIMAL(15, 2) NOT NULL,
    servicios JSONB DEFAULT '[]',
    metodo_pago_preferido VARCHAR(50),
    notas TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE,
    monto DECIMAL(15, 2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT NOW(),
    metodo_pago VARCHAR(50) NOT NULL,
    referencia VARCHAR(100),
    usuario_recibe UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Índices para facturación
CREATE INDEX IF NOT EXISTS idx_facturas_paciente ON facturas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_factura ON pagos(factura_id);

COMMENT ON TABLE facturas IS 'Registro de facturación por servicios de salud';
COMMENT ON TABLE pagos IS 'Historial de pagos recibidos contra facturas';

-- Tabla de auditoría centralizada
CREATE TABLE IF NOT EXISTS auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    recurso_tipo VARCHAR(50) NOT NULL,
    recurso_id VARCHAR(100),
    detalles JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria(created_at);

COMMENT ON TABLE auditoria IS 'Log centralizado de acciones sensibles para cumplimiento normativo (Habeas Data)';
