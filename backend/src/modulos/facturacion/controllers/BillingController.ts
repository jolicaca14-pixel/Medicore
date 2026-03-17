import { Request, Response } from 'express';
import BillingService from '../services/BillingService';

class BillingController {
    async getAllInvoices(req: Request, res: Response) {
        try {
            const invoices = await BillingService.getAllInvoices();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener facturas' });
        }
    }

    async createInvoice(req: Request, res: Response) {
        try {
            const invoice = await BillingService.createInvoice(req.body);
            res.status(201).json(invoice);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear factura' });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await BillingService.updateStatus(id, status);
            if (updated) {
                res.json(updated);
            } else {
                res.status(404).json({ error: 'Factura no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar estado' });
        }
    }

    async registerPayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const updated = await BillingService.addPayment(id, amount);
            if (updated) {
                res.json(updated);
            } else {
                res.status(404).json({ error: 'Factura no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar pago' });
        }
    }
}

export default new BillingController();
