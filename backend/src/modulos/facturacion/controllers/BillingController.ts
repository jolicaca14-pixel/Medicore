import { Request, Response } from 'express';
import { BillingService } from '../services/BillingService';

export class BillingController {
    static async getAll(req: Request, res: Response) {
        try {
            const invoices = await BillingService.getAllInvoices();
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { recordId } = req.body;
            const invoice = await BillingService.createInvoiceFromRecord(recordId);
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
