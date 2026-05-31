import { Router } from 'express';
import { RIPSController } from '../controllers/RIPSController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin', 'manager', 'accountant'));

router.get('/us', RIPSController.getUS);
router.get('/ac', RIPSController.getAC);

export default router;
