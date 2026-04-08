import { Router } from 'express';
import { BillingController } from '../controllers/BillingController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, BillingController.create);
router.get('/paciente/:patientId', authenticateToken, BillingController.getByPatient);
router.patch('/:id/status', authenticateToken, BillingController.updateStatus);

export default router;
