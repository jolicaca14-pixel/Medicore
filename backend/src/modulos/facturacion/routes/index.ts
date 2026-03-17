import { Router } from 'express';
import BillingController from '../controllers/BillingController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, BillingController.getAllInvoices);
router.post('/', authenticateToken, BillingController.createInvoice);
router.patch('/:id/status', authenticateToken, BillingController.updateStatus);
router.post('/:id/payments', authenticateToken, BillingController.registerPayment);

export default router;
