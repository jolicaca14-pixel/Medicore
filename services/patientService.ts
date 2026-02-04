import { Patient } from '../types';
import { MOCK_PATIENTS } from '../constants';
import { getAuthToken } from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/auth', '');

// Map backend patient to frontend Patient type
const mapPatient = (p: any): Patient => ({
    id: p.id,
    fullName: p.nombre_completo,
    identification: p.identificacion,
    birthDate: p.fecha_nacimiento,
    gender: p.genero,
    phone: p.telefono || '',
    email: p.email || '',
    insuranceType: p.tipo_aseguradora || '',
    allergies: p.alergias || ''
});

export const patientService = {
    async getPatients(): Promise<Patient[]> {
        const token = getAuthToken();
        if (!token) {
            console.warn('No auth token found, using mock patients');
            return MOCK_PATIENTS;
        }

        try {
            const response = await fetch(`${API_URL}/pacientes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener pacientes');
            }

            const data = await response.json();
            return data.map(mapPatient);
        } catch (error) {
            console.error('Failed to fetch patients from API, using mocks:', error);
            return MOCK_PATIENTS;
        }
    },

    async getPatientById(id: string): Promise<Patient | null> {
        const token = getAuthToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/pacientes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return null;

            const data = await response.json();
            return mapPatient(data);
        } catch (error) {
            return null;
        }
    }
};
