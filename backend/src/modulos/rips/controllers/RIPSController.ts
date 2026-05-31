import { Request, Response } from 'express';
import { RIPSService } from '../services/RIPSService';

export class RIPSController {
    static async getUS(req: Request, res: Response) {
        try {
            const { start, end } = req.query;
            const data = await RIPSService.generateUS(start as string, end as string);
            res.header('Content-Type', 'text/plain');
            res.send(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAC(req: Request, res: Response) {
        try {
            const { start, end } = req.query;
            const data = await RIPSService.generateAC(start as string, end as string);
            res.header('Content-Type', 'text/plain');
            res.send(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
