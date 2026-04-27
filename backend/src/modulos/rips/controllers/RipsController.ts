import { Request, Response } from 'express';
import { RipsService } from '../services/RipsService';

export class RipsController {
    static async downloadUS(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const content = await RipsService.generateUS(startDate as string, endDate as string);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=US.txt');
            res.send(content);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async downloadAC(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const content = await RipsService.generateAC(startDate as string, endDate as string);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=AC.txt');
            res.send(content);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
