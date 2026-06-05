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
    hash_seguridad?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePrescriptionDTO {
    historia_id: string;
    paciente_id: string;
    profesional_id: string;
    medicamentos: Medicamento[];
    diagnostico_cie11: string;
}
