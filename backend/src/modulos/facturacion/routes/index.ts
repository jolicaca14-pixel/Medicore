import { Router } from 'express';
import { BillingController } from '../controllers/BillingController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['admin', 'secretary']));

router.get('/', BillingController.getAll);
router.post('/', BillingController.create);

export default router;
