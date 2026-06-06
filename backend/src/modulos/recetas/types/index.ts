export interface Prescription {
    id: string;
    patientId: string;
    professionalId: string;
    clinicalRecordId?: string;
    date: string;
    medications: Medication[];
    status: 'active' | 'expired' | 'cancelled';
    data_hash?: string;
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    duration: string;
    quantity: number;
    observations?: string;
}

export interface CreatePrescriptionDTO {
    patientId: string;
    professionalId: string;
    clinicalRecordId?: string;
    medications: Medication[];
}
