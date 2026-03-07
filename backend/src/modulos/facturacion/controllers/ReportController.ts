import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

export class ReportController {
    static async getDailyClosing(req: Request, res: Response) {
        try {
            const date = req.query.date as string || new Date().toISOString().split('T')[0];
            const report = await ReportService.getDailyClosing(date);
            res.json(report);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getProfessionalProductivity(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const report = await ReportService.getProfessionalProductivity(startDate as string, endDate as string);
            res.json(report);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
