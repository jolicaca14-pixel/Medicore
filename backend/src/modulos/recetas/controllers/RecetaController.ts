import { Request, Response } from 'express';
import { RecetaService } from '../services/RecetaService';

export class RecetaController {
    static async create(req: Request, res: Response) {
        try {
            const receta = await RecetaService.create(req.body);
            res.status(201).json(receta);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByPatientId(req: Request, res: Response) {
        try {
            const recetas = await RecetaService.getByPatientId(req.params.patientId);
            res.json(recetas);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const receta = await RecetaService.getById(req.params.id);
            if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });
            res.json(receta);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
