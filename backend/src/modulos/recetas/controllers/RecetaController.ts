import { Request, Response } from 'express';
import { RecetaService } from '../services/RecetaService';

export class RecetaController {
    static async getAll(req: Request, res: Response) {
        try {
            const recetas = await RecetaService.getAll();
            res.json(recetas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByPatientId(req: Request, res: Response) {
        try {
            const { patientId } = req.params;
            const recetas = await RecetaService.getByPatientId(patientId);
            res.json(recetas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const receta = await RecetaService.create(req.body);
            res.status(201).json(receta);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const receta = await RecetaService.getById(id);
            if (!receta) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }
            res.json(receta);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
