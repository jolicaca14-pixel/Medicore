import { Request, Response } from 'express';
import { MetricsService } from '../services/MetricsService';

export class MetricsController {
    static async getStats(req: Request, res: Response) {
        try {
            const stats = await MetricsService.getSystemStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
