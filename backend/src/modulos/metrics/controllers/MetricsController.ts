import { Request, Response } from 'express';
import { MetricsService } from '../services/MetricsService';

export class MetricsController {
    static async getSummary(req: Request, res: Response) {
        try {
            const metrics = await MetricsService.getSystemMetrics();
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
