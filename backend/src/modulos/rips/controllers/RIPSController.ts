import { Request, Response } from 'express';
import RIPSService from '../services/RIPSService';

export class RIPSController {
    async getUS(req: Request, res: Response) {
        try {
            const data = await RIPSService.generateUS();
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=US.txt');
            res.send(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAC(req: Request, res: Response) {
        try {
            const data = await RIPSService.generateAC();
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=AC.txt');
            res.send(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new RIPSController();
