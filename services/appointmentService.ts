import { Appointment } from '../types';

const API_URL = '/api/agenda';

export const appointmentService = {
    async getAppointments(date?: string): Promise<Appointment[]> {
        const query = date ? `?date=${date}` : '';
        const response = await fetch(`${API_URL}${query}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        });
        if (!response.ok) throw new Error('Error fetching appointments');
        const data = await response.json();
        // Map backend fields to frontend
        return data.map((a: any) => ({
            id: a.id,
            patientId: a.paciente_id,
            patientName: a.patient_name,
            professionalId: a.profesional_id,
            date: a.fecha.split('T')[0],
            time: a.hora.substring(0, 5),
            reason: a.motivo,
            status: a.estado,
            procedures: a.procedimientos
        }));
    },

    async create(appointment: Partial<Appointment>): Promise<Appointment> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                patientId: appointment.patientId,
                professionalId: appointment.professionalId,
                date: appointment.date,
                time: appointment.time,
                reason: appointment.reason,
                procedures: appointment.procedures || []
            })
        });
        if (!response.ok) throw new Error('Error creating appointment');
        return await response.json();
    },

    async updateStatus(id: string, status: string): Promise<Appointment> {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Error updating appointment status');
        return await response.json();
    }
};
