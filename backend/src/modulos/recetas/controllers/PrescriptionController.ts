import { Request, Response } from 'express';
import { PrescriptionService } from '../services/PrescriptionService';

export class PrescriptionController {
    static async getByPatientId(req: Request, res: Response) {
        try {
            const recipes = await PrescriptionService.getByPatientId(req.params.patientId);
            res.json(recipes);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const prescription = await PrescriptionService.create({
                ...req.body,
                professionalId: userId
            });
            res.status(201).json(prescription);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
