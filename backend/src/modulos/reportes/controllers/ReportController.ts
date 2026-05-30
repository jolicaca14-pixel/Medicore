import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

export class ReportController {
    static async getMetrics(req: Request, res: Response) {
        try {
            const metrics = await ReportService.getMetrics();
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
