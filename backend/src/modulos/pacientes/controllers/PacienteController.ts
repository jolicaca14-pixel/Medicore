import { Request, Response } from 'express';
import PacienteService from '../services/PacienteService';

class PacienteController {
    public async getAll(req: Request, res: Response) {
        try {
            const pacientes = await PacienteService.getAll();
            res.status(200).json(pacientes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const paciente = await PacienteService.getById(id);
            if (!paciente) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }
            res.status(200).json(paciente);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const paciente = await PacienteService.create(req.body);
            res.status(201).json(paciente);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PacienteController();
