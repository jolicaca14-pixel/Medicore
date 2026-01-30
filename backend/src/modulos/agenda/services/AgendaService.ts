import pool from '../../../config/database';
import { CreateAppointmentDTO, AppointmentStatus } from '../types';

export class AgendaService {
    async getAllAppointments(date?: string) {
        let query = `
            SELECT a.*, p.nombre_completo as patient_name, u.nombre_completo as professional_name
            FROM citas a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN usuarios u ON a.profesional_id = u.id
        `;
        const params = [];
        if (date) {
            query += ` WHERE a.fecha = $1`;
            params.push(date);
        }
        query += ` ORDER BY a.fecha DESC, a.hora ASC`;

        const result = await pool.query(query, params);
        return result.rows;
    }

    async createAppointment(data: CreateAppointmentDTO) {
        const { patientId, professionalId, date, time, reason, procedures } = data;
        const result = await pool.query(
            `INSERT INTO citas (paciente_id, profesional_id, fecha, hora, motivo, procedimientos)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [patientId, professionalId, date, time, reason, JSON.stringify(procedures || [])]
        );
        return result.rows[0];
    }

    async updateStatus(id: string, status: AppointmentStatus) {
        const result = await pool.query(
            `UPDATE citas SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }

    async deleteAppointment(id: string) {
        await pool.query('DELETE FROM citas WHERE id = $1', [id]);
        return { success: true };
    }
}

export default new AgendaService();
