import { Router } from 'express';
import { BillingController } from '../controllers/BillingController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', BillingController.create);
router.get('/paciente/:patientId', BillingController.getByPatient);
router.post('/:id/pagar', BillingController.pay);

export default router;
