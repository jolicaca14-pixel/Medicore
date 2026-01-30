import { Router } from 'express';
import AgendaController from '../controllers/AgendaController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, requireRole('admin', 'secretary', 'professional'), AgendaController.getAll);
router.post('/', authenticateToken, requireRole('admin', 'secretary'), AgendaController.create);
router.patch('/:id/status', authenticateToken, requireRole('admin', 'secretary', 'professional'), AgendaController.updateStatus);
router.delete('/:id', authenticateToken, requireRole('admin', 'secretary'), AgendaController.remove);

export default router;
