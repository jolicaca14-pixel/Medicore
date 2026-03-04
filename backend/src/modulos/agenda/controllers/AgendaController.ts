import { Request, Response } from 'express';
import AgendaService from '../services/AgendaService';

export class AgendaController {
    async getAll(req: Request, res: Response) {
        try {
            const { date } = req.query;
            const appointments = await AgendaService.getAllAppointments(date as string);
            res.json(appointments);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const appointment = await AgendaService.createAppointment(req.body);
            res.status(201).json(appointment);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const appointment = await AgendaService.updateStatus(id, status);
            res.json(appointment);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await AgendaService.deleteAppointment(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AgendaController();
