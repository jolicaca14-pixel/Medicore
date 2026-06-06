import { Request, Response } from 'express';
import { RIPSService } from '../services/RIPSService';

export class RIPSController {
    static async getUS(req: Request, res: Response) {
        try {
            const csv = await RIPSService.generateUS();
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=US.txt');
            res.send(csv);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAC(req: Request, res: Response) {
        try {
            const csv = await RIPSService.generateAC();
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=AC.txt');
            res.send(csv);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
