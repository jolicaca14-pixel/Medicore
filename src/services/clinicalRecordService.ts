import { ClinicalRecord } from '../types';

// Mock service for clinical records
export const clinicalRecordService = {
  getRecordsByPatientId: async (patientId: string): Promise<ClinicalRecord[]> => {
    // In a real app, this would be a fetch call
    return [];
  },

  createRecord: async (record: Omit<ClinicalRecord, 'id'>): Promise<ClinicalRecord> => {
    return {
      ...record,
      id: Math.random().toString(36).substr(2, 9)
    } as ClinicalRecord;
  },

  updateRecord: async (id: string, record: Partial<ClinicalRecord>): Promise<ClinicalRecord> => {
    return { id, ...record } as ClinicalRecord;
  }
};
