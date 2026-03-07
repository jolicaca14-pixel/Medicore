import { Request, Response } from 'express';
import { InvoiceService } from '../services/InvoiceService';

export class InvoiceController {
    static async getAll(req: Request, res: Response) {
        try {
            const invoices = await InvoiceService.getAll();
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const invoice = await InvoiceService.getById(req.params.id);
            if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });
            res.json(invoice);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const invoice = await InvoiceService.create(req.body);
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async addPayment(req: Request, res: Response) {
        try {
            const { amount, method } = req.body;
            const payment = await InvoiceService.addPayment(req.params.id, amount, method);
            res.status(201).json(payment);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
