import { Request, Response } from 'express';
import FacturacionService from '../services/FacturacionService';

export class FacturacionController {
    async getAll(req: Request, res: Response) {
        try {
            const invoices = await FacturacionService.getAllInvoices();
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const invoice = await FacturacionService.getInvoiceById(id);
            if (!invoice) {
                return res.status(404).json({ message: 'Factura no encontrada' });
            }
            res.json(invoice);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const invoice = await FacturacionService.createInvoice(req.body);
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            await FacturacionService.updateStatus(id, estado);
            res.json({ message: 'Estado actualizado correctamente' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new FacturacionController();
