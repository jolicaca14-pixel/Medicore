import { Patient } from '../types';

const API_URL = '/api/pacientes';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar pacientes');

      const data = await response.json();
      // Transform backend fields to frontend types if necessary
      return data.map((p: any) => ({
        id: p.id,
        identification: p.identification,
        fullName: p.full_name,
        birthDate: p.birth_date,
        gender: p.gender,
        insuranceType: p.insurance_type,
        allergies: p.allergies || '',
        bloodType: p.blood_type,
        rhFactor: p.rh_factor
      }));
    } catch (error) {
      console.error('patientService.getAll error:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Patient> {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) throw new Error('Error al cargar paciente');
    const p = await response.json();
    return {
      id: p.id,
      identification: p.identification,
      fullName: p.full_name,
      birthDate: p.birth_date,
      gender: p.gender,
      insuranceType: p.insurance_type,
      allergies: p.allergies || '',
      bloodType: p.blood_type,
      rhFactor: p.rh_factor
    };
  },

  async create(patient: Partial<Patient>): Promise<Patient> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        identification: patient.identification,
        full_name: patient.fullName,
        birth_date: patient.birthDate,
        gender: patient.gender,
        insurance_type: patient.insuranceType,
        allergies: patient.allergies,
        blood_type: patient.bloodType,
        rh_factor: patient.rhFactor
      })
    });
    if (!response.ok) throw new Error('Error al crear paciente');
    const p = await response.json();
    return {
      id: p.id,
      identification: p.identification,
      fullName: p.full_name,
      birthDate: p.birth_date,
      gender: p.gender,
      insuranceType: p.insurance_type,
      allergies: p.allergies || '',
      bloodType: p.blood_type,
      rhFactor: p.rh_factor
    };
  }
};
