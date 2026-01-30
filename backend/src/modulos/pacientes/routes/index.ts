import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

// Todas las rutas de pacientes requieren autenticación
router.use(authenticateToken);

router.get('/', PatientController.getAll);
router.get('/:id', PatientController.getById);
router.post('/', PatientController.create);

export default router;
