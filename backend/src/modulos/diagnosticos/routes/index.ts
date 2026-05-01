import { Router } from 'express';
import { DiagnosticController } from '../controllers/DiagnosticController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', DiagnosticController.create);
router.get('/paciente/:patientId', DiagnosticController.getByPatientId);
router.patch('/:id/validar', DiagnosticController.validate);

export default router;
