import { Router } from 'express';
import { RecetaController } from '../controllers/RecetaController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', RecetaController.getAll);
router.get('/paciente/:patientId', RecetaController.getByPatientId);
router.get('/:id', RecetaController.getById);
router.post('/', RecetaController.create);

export default router;
