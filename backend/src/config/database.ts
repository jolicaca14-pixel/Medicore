import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de conexión a PostgreSQL
export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'medicore',
    password: process.env.DB_PASSWORD || 'medicore_dev_2024',
    database: process.env.DB_NAME || 'medicore_db',
    max: 20, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test de conexión
pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en PostgreSQL:', err);
    process.exit(-1);
});

export default pool;
