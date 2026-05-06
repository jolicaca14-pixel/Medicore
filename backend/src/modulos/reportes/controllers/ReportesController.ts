import { Request, Response } from 'express';
import { ReportesService } from '../services/ReportesService';

export class ReportesController {
    static async getMetrics(req: Request, res: Response) {
        try {
            const metrics = await ReportesService.getDashboardMetrics();
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
