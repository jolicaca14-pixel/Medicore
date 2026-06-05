import { Request, Response } from 'express';
import PrescriptionService from '../services/PrescriptionService';

export class PrescriptionController {
    async getByPatient(req: Request, res: Response) {
        try {
            const { paciente_id } = req.params;
            const prescriptions = await PrescriptionService.getPrescriptionsByPatient(paciente_id);
            res.json(prescriptions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const prescription = await PrescriptionService.getPrescriptionById(id);
            if (!prescription) {
                return res.status(404).json({ message: 'Prescripción no encontrada' });
            }
            res.json(prescription);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const prescription = await PrescriptionService.createPrescription(req.body);
            res.status(201).json(prescription);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PrescriptionController();
