import { Router } from 'express';
import { FacturacionController } from '../controllers/FacturacionController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/paciente/:patientId', FacturacionController.getByPatientId);
router.post('/generar', requireRole('admin', 'professional', 'secretary'), FacturacionController.generate);

export default router;
