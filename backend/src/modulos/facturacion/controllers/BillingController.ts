import { Request, Response } from 'express';
import { BillingService } from '../services/BillingService';

export class BillingController {
    static async create(req: Request, res: Response) {
        try {
            const { invoiceData, items } = req.body;
            const invoice = await BillingService.createInvoice(invoiceData, items);
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getByPatient(req: Request, res: Response) {
        try {
            const { patientId } = req.params;
            const invoices = await BillingService.getInvoicesByPatient(patientId);
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
