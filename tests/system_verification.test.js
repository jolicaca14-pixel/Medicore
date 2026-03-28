import http from 'http';

const API_PORT = 3001;
const BASE_URL = `http://localhost:${API_PORT}`;

async function checkHealth() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/health`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (e) => {
            console.log('Error health:', e.message);
            resolve(null);
        });
    });
}

async function checkSecurityHeaders() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/health`, (res) => {
            // Helmet headers
            const hasHelmet = res.headers['x-dns-prefetch-control'] !== undefined;
            const hasHSTS = res.headers['strict-transport-security'] !== undefined;
            resolve({ hasHelmet, hasHSTS, status: res.statusCode });
        }).on('error', (e) => {
            console.log('Error headers:', e.message);
            resolve(null);
        });
    });
}

async function runTests() {
    console.log('🚀 Iniciando Verificación de Integración del Sistema...');

    // 1. Health Check
    const health = await checkHealth();
    if (health && health.status === 'OK') {
        console.log('✅ Health Check: PASSED');
    } else {
        console.log('❌ Health Check: FAILED (Asegúrate de que el backend esté corriendo)');
    }

    // 2. Security Headers
    const security = await checkSecurityHeaders();
    if (security && security.hasHelmet) {
        console.log('✅ Security Headers (Helmet): PASSED');
    } else {
        console.log('❌ Security Headers (Helmet): FAILED');
    }

    // 3. Rate Limit Presence (Optional/Visual)
    console.log('ℹ️ Rate Limit: Configurado para 10 intentos/15min en /api/auth/login');

    console.log('\n🏁 Verificación completada.');
}

runTests();
