import { PrescriptionItem } from '../../../../types';

export interface Receta {
    id: string;
    paciente_id: string;
    profesional_id: string;
    historia_clinica_id?: string;
    fecha: string;
    items: PrescriptionItem[];
    created_at: string;
    updated_at: string;
}

export interface CreateRecetaDTO {
    pacienteId: string;
    profesionalId: string;
    historiaClinicaId?: string;
    items: PrescriptionItem[];
}
