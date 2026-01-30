import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService';

export class PatientController {
    static async getAll(req: Request, res: Response) {
        try {
            // 🛡️ MORPHEUS: Audit log for mass patient data access
            console.log(`[AUDIT] User ${req.user?.id} accessed ALL patients list at ${new Date().toISOString()}`);

            const patients = await PatientService.getAll();
            res.json(patients);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            // 🛡️ MORPHEUS: Audit log for specific patient access
            console.log(`[AUDIT] User ${req.user?.id} accessed patient ${req.params.id} at ${new Date().toISOString()}`);

            const patient = await PatientService.getById(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.json(patient);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const patient = await PatientService.create(req.body);
            res.status(201).json(patient);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
