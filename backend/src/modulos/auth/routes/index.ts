import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';
import { MetricsService } from '../services/MetricsService';

const router = Router();

/**
 * POST /api/auth/login
 * Autenticar usuario
 */
router.post('/login', AuthController.login);

/**
 * POST /api/auth/refresh
 * Renovar access token
 */
router.post('/refresh', AuthController.refresh);

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post('/logout', AuthController.logout);

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado
 * Requiere autenticación
 */
router.get('/me', authenticateToken, AuthController.me);

router.get('/metrics', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const metrics = await MetricsService.getOverviewMetrics();
        res.json(metrics);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
