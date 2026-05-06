import { Router } from 'express';
import { RIPSController } from '../controllers/RIPSController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/us', RIPSController.getUS);
router.get('/ac', RIPSController.getAC);

export default router;
