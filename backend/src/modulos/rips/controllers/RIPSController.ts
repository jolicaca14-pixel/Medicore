import { Request, Response } from 'express';
import { RIPSService } from '../services/RIPSService';

export class RIPSController {
    static async getUS(req: Request, res: Response) {
        try {
            const { patientId } = req.query;
            const content = await RIPSService.generateUS(patientId as string);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=US.txt');
            res.send(content);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAC(req: Request, res: Response) {
        try {
            const { patientId } = req.query;
            const content = await RIPSService.generateAC(patientId as string);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=AC.txt');
            res.send(content);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
