import { Request, Response } from 'express';
import { RIPSService } from '../services/RIPSService';

export class RIPSController {
    static async getUS(req: Request, res: Response) {
        try {
            const data = await RIPSService.generateUS();
            res.header('Content-Type', 'text/plain');
            res.attachment('US_MediCore.txt');
            res.send(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAC(req: Request, res: Response) {
        try {
            const data = await RIPSService.generateAC();
            res.header('Content-Type', 'text/plain');
            res.attachment('AC_MediCore.txt');
            res.send(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
