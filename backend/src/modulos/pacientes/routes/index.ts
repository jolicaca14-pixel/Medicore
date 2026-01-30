import { Router } from 'express';
import PatientController from '../controllers/PatientController';
import { authenticateToken } from '../../auth/middlewares/authMiddleware';

const router = Router();

/**
 * GET /api/pacientes
 * Obtener todos los pacientes
 */
router.get('/', authenticateToken, PatientController.getAll);

/**
 * GET /api/pacientes/:id
 * Obtener paciente por identificación
 */
router.get('/:id', authenticateToken, PatientController.getByIdentification);

/**
 * POST /api/pacientes
 * Crear un nuevo paciente
 */
router.post('/', authenticateToken, PatientController.create);

export default router;
