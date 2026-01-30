export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    WAITING = 'WAITING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName?: string;
    professionalId: string;
    date: string; // ISO Date YYYY-MM-DD
    time: string; // HH:mm
    reason: string;
    status: AppointmentStatus;
    procedures?: any[]; // Simplified for backend storage as JSON
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAppointmentDTO {
    patientId: string;
    professionalId: string;
    date: string;
    time: string;
    reason: string;
    status?: AppointmentStatus;
    procedures?: any[];
}
