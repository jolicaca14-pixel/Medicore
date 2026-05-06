import { Prescription } from '../types';
import { v4 as uuidv4 } from 'uuid';

let prescriptions: Prescription[] = [];

export class RecetaService {
    static async getAll(): Promise<Prescription[]> {
        return prescriptions;
    }

    static async getByPatientId(patientId: string): Promise<Prescription[]> {
        return prescriptions.filter(p => p.patientId === patientId);
    }

    static async create(data: Partial<Prescription>): Promise<Prescription> {
        const newPrescription: Prescription = {
            ...data,
            id: uuidv4(),
            date: new Date().toISOString(),
            items: data.items || []
        } as Prescription;
        prescriptions.push(newPrescription);
        return newPrescription;
    }

    static async getById(id: string): Promise<Prescription | undefined> {
        return prescriptions.find(p => p.id === id);
    }
}
