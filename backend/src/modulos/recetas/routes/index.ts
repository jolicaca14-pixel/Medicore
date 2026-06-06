import { Router } from 'express';
import { PrescriptionController } from '../controllers/PrescriptionController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/paciente/:patientId', PrescriptionController.getByPatientId);
router.post('/', PrescriptionController.create);

export default router;
