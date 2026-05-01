import { Request, Response } from 'express';
import { DiagnosticService } from '../services/DiagnosticService';

export class DiagnosticController {
    static async create(req: Request, res: Response) {
        try {
            const result = await DiagnosticService.create(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByPatientId(req: Request, res: Response) {
        try {
            const results = await DiagnosticService.getByPatientId(req.params.patientId);
            res.json(results);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async validate(req: Request, res: Response) {
        try {
            const result = await DiagnosticService.validateResult(req.params.id, req.user.userId, req.body);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
