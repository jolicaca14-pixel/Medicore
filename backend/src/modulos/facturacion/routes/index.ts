import { Router } from 'express';
import { BillingController } from '../controllers/BillingController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin', 'secretary'));

router.get('/', BillingController.getInvoices);
router.post('/', BillingController.createInvoice);
router.post('/:id/pagos', BillingController.registerPayment);

export default router;
