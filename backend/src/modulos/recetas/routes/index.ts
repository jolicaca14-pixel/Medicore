import { Router } from 'express';
import { RecetaController } from '../controllers/RecetaController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', RecetaController.create);
router.get('/paciente/:patientId', RecetaController.getByPatientId);
router.get('/:id', RecetaController.getById);

export default router;
