const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Medicamento {
  farmaco: string;
  dosis: string;
  frecuencia: string;
  via: string;
  duracion: string;
  cantidad: number;
  recomendaciones?: string;
}

export interface Prescription {
  id: string;
  historia_id: string;
  paciente_id: string;
  profesional_id: string;
  medicamentos: Medicamento[];
  diagnostico_cie11: string;
  ruta_pdf_generado?: string;
  created_at: string;
}

export interface CreatePrescriptionDTO {
  historia_id: string;
  paciente_id: string;
  profesional_id: string;
  medicamentos: Medicamento[];
  diagnostico_cie11: string;
}

export const prescriptionService = {
  async getByPatient(paciente_id: string): Promise<Prescription[]> {
    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/recetas/paciente/${paciente_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener recetas');
    return response.json();
  },

  async create(data: CreatePrescriptionDTO): Promise<Prescription> {
    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/recetas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear receta');
    return response.json();
  }
};
