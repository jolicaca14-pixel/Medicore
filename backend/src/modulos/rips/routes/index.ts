import { Router } from 'express';
import { RipsController } from '../controllers/RipsController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.get('/us', authenticateToken, RipsController.exportUS);
router.get('/ac', authenticateToken, RipsController.exportAC);

export default router;
