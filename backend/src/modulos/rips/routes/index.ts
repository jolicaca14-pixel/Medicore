import { Router } from 'express';
import { RIPSController } from '../controllers/RIPSController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/', RIPSController.getRIPS);

export default router;
