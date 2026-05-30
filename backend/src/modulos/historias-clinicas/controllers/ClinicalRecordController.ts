import { Request, Response } from 'express';
import { ClinicalRecordService } from '../services/ClinicalRecordService';

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

    static async finalize(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { signature } = req.body;
            const record = await ClinicalRecordService.finalize(id, signature);
            if (!record) return res.status(404).json({ message: 'Historia no encontrada' });
            return res.json(record);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
