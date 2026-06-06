import { Request, Response } from 'express';
import { FacturacionService } from '../services/FacturacionService';

export class FacturacionController {
    static async getByPatientId(req: Request, res: Response) {
        try {
            const invoices = await FacturacionService.getByPatientId(req.params.patientId);
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const invoice = await FacturacionService.createInvoice(req.body);
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
