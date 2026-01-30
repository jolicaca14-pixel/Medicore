export interface Patient {
    id: string;
    fullName: string;
    identification: string;
    birthDate: string;
    gender: 'M' | 'F';
    bloodType?: string;
    phone: string;
    email: string;
    insuranceType: string;
    allergies?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePatientDTO {
    fullName: string;
    identification: string;
    birthDate: string;
    gender: 'M' | 'F';
    bloodType?: string;
    phone: string;
    email: string;
    insuranceType: string;
    allergies?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}
