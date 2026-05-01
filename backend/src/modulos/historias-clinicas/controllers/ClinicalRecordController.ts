import { Request, Response } from 'express';
import { ClinicalRecordService } from '../services/ClinicalRecordService';
import { AuthService } from '../../auth/services/AuthService';

export class ClinicalRecordController {
    static async getByPatientId(req: Request, res: Response) {
        try {
            const records = await ClinicalRecordService.getByPatientId(req.params.patientId);
            res.json(records);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const record = await ClinicalRecordService.createOrUpdate(req.body);
            res.status(201).json(record);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async finalize(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { signature, password } = req.body;

            // 🛡️ MORPHEUS: Re-autenticación obligatoria para cierre de historia
            if (!password) {
                return res.status(401).json({ message: 'La contraseña es obligatoria para finalizar la historia.' });
            }

            if (!req.user) {
                return res.status(401).json({ message: 'Usuario no identificado.' });
            }

            const isPasswordValid = await AuthService.verifyUserPassword(req.user.userId, password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Contraseña incorrecta. No se puede finalizar la historia.' });
            }

            const record = await ClinicalRecordService.finalize(id, signature || 'digital_signature');
            if (!record) return res.status(404).json({ message: 'Historia no encontrada' });
            res.json(record);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
