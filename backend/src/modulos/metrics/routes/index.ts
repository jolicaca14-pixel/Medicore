import { Router } from 'express';
import { MetricsController } from '../controllers/MetricsController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/', MetricsController.getSummary);

export default router;
