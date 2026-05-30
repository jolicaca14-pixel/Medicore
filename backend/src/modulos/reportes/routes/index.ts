import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/metrics', ReportController.getMetrics);

export default router;
