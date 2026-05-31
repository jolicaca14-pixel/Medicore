import { Request, Response } from 'express';
import { PrescriptionService } from '../services/PrescriptionService';

export class PrescriptionController {
    static async getByPatientId(req: Request, res: Response) {
        try {
            const { patientId } = req.params;
            const prescriptions = await PrescriptionService.getByPatientId(patientId);
            res.json(prescriptions);
        } catch (error: any) {
            console.error('[PrescriptionController.getByPatientId]', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const prescription = await PrescriptionService.create(req.body);
            res.status(201).json(prescription);
        } catch (error: any) {
            console.error('[PrescriptionController.create]', error);
            res.status(500).json({ message: error.message });
        }
    }
}
