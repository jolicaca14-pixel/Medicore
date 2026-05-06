import { Router } from 'express';
import { ClinicalRecordController } from '../controllers/ClinicalRecordController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/paciente/:patientId', ClinicalRecordController.getByPatientId);
router.get('/diagnosticos/search', ClinicalRecordController.searchICD);
router.post('/', ClinicalRecordController.create);
router.post('/:id/finalizar', ClinicalRecordController.finalize);

export default router;
