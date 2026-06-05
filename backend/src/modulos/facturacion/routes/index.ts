import { Router } from 'express';
import FacturacionController from '../controllers/FacturacionController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', requireRole('admin', 'secretary', 'professional'), FacturacionController.getAll);
router.get('/:id', requireRole('admin', 'secretary', 'professional'), FacturacionController.getById);
router.post('/', requireRole('admin', 'secretary'), FacturacionController.create);
router.patch('/:id/estado', requireRole('admin', 'secretary'), FacturacionController.updateStatus);

export default router;
