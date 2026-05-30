import { Request, Response } from 'express';
import { BillingService } from '../services/BillingService';

export class BillingController {
    static async getInvoices(req: Request, res: Response) {
        try {
            const invoices = await BillingService.getInvoices();
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createInvoice(req: Request, res: Response) {
        try {
            const invoice = await BillingService.createInvoice(req.body);
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async registerPayment(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const invoice = await BillingService.registerPayment(id, req.body);
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
            return res.json(invoice);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
