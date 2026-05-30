import { Request, Response } from 'express';
import { RIPSService } from '../services/RIPSService';

export class RIPSController {
    static async getRIPS(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query as { startDate: string, endDate: string };
            const rips = await RIPSService.generateRIPS(startDate, endDate);
            res.json(rips);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
