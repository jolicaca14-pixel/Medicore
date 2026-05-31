import { PrescriptionItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Prescription {
    id: string;
    historiaId: string;
    patientId: string;
    professionalId: string;
    medicationName: string;
    dose: string;
    frequency: string;
    route: string;
    duration: string;
    totalQuantity: number;
    observations: string;
    createdAt: string;
}

export const prescriptionService = {
  async getByPatientId(patientId: string): Promise<Prescription[]> {
    try {
      const response = await fetch(`${API_URL}/recetas/paciente/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener recetas');
      return await response.json();
    } catch (error) {
      console.error('PrescriptionService.getByPatientId error:', error);
      throw error;
    }
  },

  async create(prescription: Partial<Prescription>): Promise<Prescription> {
    try {
      const response = await fetch(`${API_URL}/recetas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(prescription)
      });
      if (!response.ok) throw new Error('Error al crear receta');
      return await response.json();
    } catch (error) {
      console.error('PrescriptionService.create error:', error);
      throw error;
    }
  }
};
