export interface PrescriptionItem {
    medication: string;
    presentation: string;
    dosage: string;
    frequency: string;
    duration: string;
    indications: string;
}

export interface Prescription {
    id: string;
    patientId: string;
    professionalId: string;
    clinicalRecordId?: string;
    date: string;
    items: PrescriptionItem[];
    notes?: string;
}
