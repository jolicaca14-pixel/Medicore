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

export interface CreatePrescriptionDTO {
    historiaId?: string;
    patientId: string;
    professionalId: string;
    medicationName: string;
    dose: string;
    frequency: string;
    route: string;
    duration: string;
    totalQuantity: number;
    observations?: string;
}
