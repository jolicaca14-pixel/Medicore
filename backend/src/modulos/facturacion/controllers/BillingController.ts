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
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { estado, metodo_pago } = req.body;
            const invoice = await BillingService.updateStatus(id, estado, metodo_pago);
            res.json(invoice);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
