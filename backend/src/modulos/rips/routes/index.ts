import { Router } from 'express';
import RIPSController from '../controllers/RIPSController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin')); // Solo administradores pueden generar RIPS

router.get('/us', RIPSController.getUS);
router.get('/ac', RIPSController.getAC);

export default router;
