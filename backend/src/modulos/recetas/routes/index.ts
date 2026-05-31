import { Router } from 'express';
import { PrescriptionController } from '../controllers/PrescriptionController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/paciente/:patientId', PrescriptionController.getByPatientId);
router.post('/', requireRole('admin', 'professional'), PrescriptionController.create);

export default router;
