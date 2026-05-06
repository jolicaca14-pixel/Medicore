import { Router } from 'express';
import { ReportesController } from '../controllers/ReportesController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/metrics', ReportesController.getMetrics);

export default router;
