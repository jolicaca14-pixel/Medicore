import { ClinicalRecord } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const clinicalRecordService = {
  async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
    try {
      const response = await fetch(`${API_URL}/historias-clinicas/paciente/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
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
      const response = await fetch(`${API_URL}/historias-clinicas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
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

  async finalize(id: string, password?: string): Promise<ClinicalRecord> {
    try {
      const signature = `SIG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const response = await fetch(`${API_URL}/historias-clinicas/${id}/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ signature, password })
      });
      if (!response.ok) throw new Error('Error al finalizar historia');
      return await response.json();
    } catch (error) {
      console.error('ClinicalRecordService.finalize error:', error);
      throw error;
    }
  }
};
