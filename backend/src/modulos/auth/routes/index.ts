import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middlewares/authMiddleware';

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

export default router;
