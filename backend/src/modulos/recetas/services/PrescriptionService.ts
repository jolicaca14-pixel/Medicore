import pool from '../../../config/database';
import { Prescription, CreatePrescriptionDTO } from '../types';

export class PrescriptionService {
    static async getByPatientId(patientId: string): Promise<Prescription[]> {
        const query = `
            SELECT
                id, historia_id as "historiaId", paciente_id as "patientId",
                profesional_id as "professionalId", medicamento as "medicationName",
                dosis as "dose", frecuencia as "frequency", via as "route",
                duracion as "duration", cantidad_total as "totalQuantity",
                observaciones as "observations", created_at as "createdAt"
            FROM recetas
            WHERE paciente_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async create(data: CreatePrescriptionDTO): Promise<Prescription> {
        const query = `
            INSERT INTO recetas (
                historia_id, paciente_id, profesional_id, medicamento,
                dosis, frecuencia, via, duracion, cantidad_total, observaciones
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, historia_id as "historiaId", paciente_id as "patientId",
                profesional_id as "professionalId", medicamento as "medicationName",
                dosis as "dose", frecuencia as "frequency", via as "route",
                duracion as "duration", cantidad_total as "totalQuantity",
                observaciones as "observations", created_at as "createdAt"
        `;
        const values = [
            data.historiaId, data.patientId, data.professionalId, data.medicationName,
            data.dose, data.frequency, data.route, data.duration,
            data.totalQuantity, data.observations
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}
