import { Router } from 'express';
import PrescriptionController from '../controllers/PrescriptionController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

// Todas las rutas de recetas requieren autenticación
router.use(authenticateToken);

router.get('/paciente/:paciente_id', requireRole('admin', 'professional', 'secretary'), PrescriptionController.getByPatient);
router.get('/:id', requireRole('admin', 'professional', 'secretary'), PrescriptionController.getById);
router.post('/', requireRole('admin', 'professional'), PrescriptionController.create);

export default router;
