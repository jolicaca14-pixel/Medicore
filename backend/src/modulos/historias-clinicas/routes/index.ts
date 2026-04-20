import { Router } from 'express';
import { ClinicalRecordController } from '../controllers/ClinicalRecordController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

// 🛡️ MORPHEUS: Auditoría de RBAC para HCE
// El administrador no debe ver contenido clínico, pero puede ver metadatos si fuera necesario.
// El profesional y la secretaria (para trámites) pueden listar, pero solo el profesional crea/finaliza.
router.get('/paciente/:patientId', requireRole('professional', 'secretary'), ClinicalRecordController.getByPatientId);
router.post('/', requireRole('professional'), ClinicalRecordController.create);
router.post('/:id/finalizar', requireRole('professional'), ClinicalRecordController.finalize);

export default router;
