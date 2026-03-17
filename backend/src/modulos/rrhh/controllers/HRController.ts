import { Request, Response } from 'express';
import HRService from '../services/HRService';

class HRController {
    async getMyContract(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ error: 'No autorizado' });

            const contract = await HRService.getContractByUserId(userId);
            res.json(contract || null);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener contrato' });
        }
    }

    async getMyDisciplinary(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ error: 'No autorizado' });

            const records = await HRService.getDisciplinaryByUserId(userId);
            res.json(records);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener historial' });
        }
    }

    async respondDisciplinary(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { response } = req.body;
            const updated = await HRService.addDisciplinaryResponse(id, response);
            if (updated) {
                res.json(updated);
            } else {
                res.status(404).json({ error: 'Registro no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al responder' });
        }
    }
}

export default new HRController();
