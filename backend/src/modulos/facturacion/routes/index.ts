import { Router } from 'express';
import { FacturacionController } from '../controllers/FacturacionController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', requireRole(['admin', 'secretary']), FacturacionController.getAll);
router.post('/generar', requireRole(['admin', 'professional']), FacturacionController.generateFromRecord);
router.post('/rips', requireRole(['admin', 'secretary']), FacturacionController.downloadRIPS);

export default router;
