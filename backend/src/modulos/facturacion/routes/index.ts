import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { ReportController } from '../controllers/ReportController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', requireRole('admin', 'secretary'), InvoiceController.getAll);
router.get('/:id', requireRole('admin', 'secretary'), InvoiceController.getById);
router.post('/', requireRole('admin', 'secretary'), InvoiceController.create);
router.post('/:id/pagos', requireRole('admin', 'secretary'), InvoiceController.addPayment);

// Reports
router.get('/reportes/cierre-diario', requireRole('admin'), ReportController.getDailyClosing);
router.get('/reportes/productividad', requireRole('admin'), ReportController.getProfessionalProductivity);

export default router;
