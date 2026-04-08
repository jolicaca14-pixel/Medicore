import { Request, Response } from 'express';
import { RipsService } from '../services/RipsService';

export class RipsController {
    static async exportUS(req: Request, res: Response) {
        try {
            const content = await RipsService.generateUS();
            res.setHeader('Content-disposition', 'attachment; filename=US.txt');
            res.setHeader('Content-type', 'text/plain');
            res.charset = 'UTF-8';
            res.send(content);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async exportAC(req: Request, res: Response) {
        try {
            const content = await RipsService.generateAC();
            res.setHeader('Content-disposition', 'attachment; filename=AC.txt');
            res.setHeader('Content-type', 'text/plain');
            res.charset = 'UTF-8';
            res.send(content);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
