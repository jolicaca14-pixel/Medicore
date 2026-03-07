import { Router } from 'express';
import { ClinicalRecordController } from '../controllers/ClinicalRecordController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/paciente/:patientId', ClinicalRecordController.getByPatientId);
router.post('/', requireRole('professional', 'admin'), ClinicalRecordController.create);
router.post('/:id/finalizar', requireRole('professional', 'admin'), ClinicalRecordController.finalize);

export default router;
