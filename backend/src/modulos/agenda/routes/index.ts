import { Router } from 'express';
import AgendaController from '../controllers/AgendaController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', requireRole('admin', 'professional', 'secretary'), AgendaController.getAll);
router.post('/', requireRole('admin', 'secretary'), AgendaController.create);

export default router;
