import { Patient } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_URL}/pacientes`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener pacientes');
      return await response.json();
    } catch (error) {
      console.error('PatientService.getAll error:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Patient> {
    try {
      const response = await fetch(`${API_URL}/pacientes/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener paciente');
      return await response.json();
    } catch (error) {
      console.error('PatientService.getById error:', error);
      throw error;
    }
  },

  async create(patient: Omit<Patient, 'id'>): Promise<Patient> {
    try {
      const response = await fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(patient)
      });
      if (!response.ok) throw new Error('Error al crear paciente');
      return await response.json();
    } catch (error) {
      console.error('PatientService.create error:', error);
      throw error;
    }
  }
};
