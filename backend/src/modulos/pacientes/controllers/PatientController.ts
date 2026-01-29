import { Request, Response } from 'express';
import PatientService from '../services/PatientService';

export class PatientController {
    async getAll(req: Request, res: Response) {
        try {
            const patients = await PatientService.getAllPatients();
            res.json(patients);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByIdentification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const patient = await PatientService.getPatientByIdentification(id);
            if (!patient) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }
            res.json(patient);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const patient = await PatientService.createPatient(req.body);
            res.status(201).json(patient);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new PatientController();
