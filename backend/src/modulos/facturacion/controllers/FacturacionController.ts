import { Request, Response } from 'express';
import { FacturacionService } from '../services/FacturacionService';
import { RIPSService } from '../services/RIPSService';

export class FacturacionController {
    static async getAll(req: Request, res: Response) {
        try {
            const invoices = await FacturacionService.getAllInvoices();
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async generateFromRecord(req: Request, res: Response) {
        try {
            const { recordId } = req.body;
            const invoice = await FacturacionService.generateFromClinicalRecord(recordId);
            if (!invoice) return res.status(400).json({ message: 'No se pudo generar factura. Verifique que la historia tenga procedimientos.' });
            res.status(201).json(invoice);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async downloadRIPS(req: Request, res: Response) {
        try {
            const { type, invoiceIds } = req.body;
            let content = '';
            if (type === 'US') {
                content = await RIPSService.generateUS(invoiceIds);
            } else if (type === 'AC') {
                content = await RIPSService.generateAC(invoiceIds);
            } else {
                return res.status(400).json({ message: 'Tipo de RIPS no soportado' });
            }

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename=${type}.txt`);
            res.send(content);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
