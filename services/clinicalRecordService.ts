import { ClinicalRecord } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const clinicalRecordService = {
  async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
    try {
      const response = await fetch(`${API_URL}/historias/paciente/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener historias clínicas');
      return await response.json();
    } catch (error) {
      console.error('ClinicalRecordService.getByPatientId error:', error);
      throw error;
    }
  },

  async create(record: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_URL}/historias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(record)
      });
      if (!response.ok) throw new Error('Error al guardar historia');
      return await response.json();
    } catch (error) {
      console.error('ClinicalRecordService.create error:', error);
      throw error;
    }
  },

  async finalize(id: string, signature: string): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_URL}/historias/${id}/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ signature })
      });
      if (!response.ok) throw new Error('Error al finalizar historia');
      return await response.json();
    } catch (error) {
      console.error('ClinicalRecordService.finalize error:', error);
      throw error;
    }
  }
};
