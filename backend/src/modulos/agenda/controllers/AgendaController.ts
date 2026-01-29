import { Request, Response } from 'express';
import AgendaService from '../services/AgendaService';

class AgendaController {
    public async getAll(req: Request, res: Response) {
        try {
            const { professionalId } = req.query;
            const citas = await AgendaService.getAll(professionalId as string);
            res.status(200).json(citas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const cita = await AgendaService.create(req.body);
            res.status(201).json(cita);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new AgendaController();
