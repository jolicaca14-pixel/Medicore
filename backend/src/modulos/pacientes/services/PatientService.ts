import { Patient, CreatePatientDTO } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock DB for demonstration
let patients: Patient[] = [
    {
        id: 'p1',
        fullName: 'Juan Pérez',
        identification: '123456789',
        birthDate: '1985-04-12',
        gender: 'M',
        phone: '300-555-0101',
        email: 'juan.perez@ejemplo.com',
        insuranceType: 'EPS Sura - Contributivo',
        allergies: 'Penicilina, AINES'
    },
    {
        id: 'p2',
        fullName: 'María González',
        identification: '987654321',
        birthDate: '1952-08-23',
        gender: 'F',
        phone: '300-555-0102',
        email: 'maria.gonzalez@ejemplo.com',
        insuranceType: 'Sanitas - Subsidiado'
    }
];

export class PatientService {
    static async getAll(): Promise<Patient[]> {
        return patients;
    }

    static async getById(id: string): Promise<Patient | undefined> {
        return patients.find(p => p.id === id);
    }

    static async getByIdentification(idNum: string): Promise<Patient | undefined> {
        return patients.find(p => p.identification === idNum);
    }

    static async create(data: CreatePatientDTO): Promise<Patient> {
        const newPatient: Patient = {
            id: uuidv4(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        patients.push(newPatient);
        return newPatient;
    }

    static async update(id: string, data: Partial<CreatePatientDTO>): Promise<Patient | undefined> {
        const index = patients.findIndex(p => p.id === id);
        if (index === -1) return undefined;

        patients[index] = {
            ...patients[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        return patients[index];
    }
}
