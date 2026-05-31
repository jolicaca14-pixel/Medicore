import { Request, Response } from 'express';
import { FacturacionService } from '../services/FacturacionService';

export class FacturacionController {
    static async getByPatientId(req: Request, res: Response) {
        try {
            const { patientId } = req.params;
            const facturas = await FacturacionService.getByPatientId(patientId);
            res.json(facturas);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async generate(req: Request, res: Response) {
        try {
            const { recordId } = req.body;
            const factura = await FacturacionService.generateFromClinicalRecord(recordId);
            res.status(201).json(factura);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
