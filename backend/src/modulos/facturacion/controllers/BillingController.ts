import { Request, Response } from 'express';
import { BillingService } from '../services/BillingService';

export class BillingController {
    static async create(req: Request, res: Response) {
        try {
            const invoice = await BillingService.createInvoice(req.body);
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByPatient(req: Request, res: Response) {
        try {
            const invoices = await BillingService.getInvoicesByPatient(req.params.patientId);
            res.status(200).json(invoices);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async pay(req: Request, res: Response) {
        try {
            const { amount, method, userId } = req.body;
            const result = await BillingService.registerPayment(req.params.id, amount, method, userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
