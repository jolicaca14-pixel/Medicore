import { Router } from 'express';
import PacienteController from '../controllers/PacienteController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

// Todas las rutas de pacientes requieren autenticación
router.use(authenticateToken);

router.get('/', requireRole('admin', 'professional', 'secretary'), PacienteController.getAll);
router.get('/:id', requireRole('admin', 'professional', 'secretary'), PacienteController.getById);
router.post('/', requireRole('admin', 'secretary'), PacienteController.create);

export default router;
