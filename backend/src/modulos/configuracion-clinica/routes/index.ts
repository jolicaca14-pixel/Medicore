import { Router } from 'express';
import { ClinicalConfigController } from '../controllers/ClinicalConfigController';
import { authenticateToken, requireRole } from '../../auth/middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/templates', ClinicalConfigController.getTemplates);
router.post('/templates', ClinicalConfigController.createTemplate);

router.get('/sections', ClinicalConfigController.getSections);
router.post('/sections', ClinicalConfigController.createSection);

router.get('/fields', ClinicalConfigController.getFields);
router.post('/fields', ClinicalConfigController.createField);

export default router;
