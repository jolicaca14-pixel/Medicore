import { Router } from 'express';
import { RipsController } from '../controllers/RipsController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/us', RipsController.downloadUS);
router.get('/ac', RipsController.downloadAC);

export default router;
