import { Router } from 'express';
import HRController from '../controllers/HRController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.get('/my-contract', authenticateToken, HRController.getMyContract);
router.get('/my-disciplinary', authenticateToken, HRController.getMyDisciplinary);
router.post('/disciplinary/:id/respond', authenticateToken, HRController.respondDisciplinary);

export default router;
