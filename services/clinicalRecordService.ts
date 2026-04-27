import { ClinicalRecord } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 🛡️ TRINITY: Integración con Backend Persistente (Neo)
export const clinicalRecordService = {
  async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
    try {
      const response = await fetch(`${API_URL}/historias-clinicas/paciente/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener historias clínicas');
      return await response.json();
    } catch (error) {
      console.error('ClinicalRecordService.getByPatientId error:', error);
      // Fallback a array vacío en lugar de error fatal para no bloquear la UI
      return [];
    }
  },

  async create(record: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_URL}/historias-clinicas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(record)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar historia');
      }
      return await response.json();
    } catch (error) {
      console.error('ClinicalRecordService.create error:', error);
      throw error;
    }
  },

  async finalize(id: string, signature: string): Promise<ClinicalRecord> {
    try {
      const response = await fetch(`${API_URL}/historias-clinicas/${id}/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ signature })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al finalizar historia');
      }
      return await response.json();
    } catch (error) {
      console.error('ClinicalRecordService.finalize error:', error);
      throw error;
    }
  }
};
