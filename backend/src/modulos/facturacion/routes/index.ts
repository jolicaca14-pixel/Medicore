import { Router } from 'express';
import { FacturacionController } from '../controllers/FacturacionController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/paciente/:patientId', FacturacionController.getByPatientId);
router.post('/', FacturacionController.create);

export default router;
