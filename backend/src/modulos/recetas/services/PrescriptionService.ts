import pool from '../../../config/database';
import { CreatePrescriptionDTO, Prescription } from '../types';
import crypto from 'crypto';

export class PrescriptionService {
    static async getByPatientId(patientId: string): Promise<Prescription[]> {
        const query = `
            SELECT
                id, paciente_id as "patientId", profesional_id as "professionalId",
                historia_id as "clinicalRecordId", fecha as "date",
                medicamentos as "medications", estado as "status",
                data_hash as "data_hash"
            FROM recetas
            WHERE paciente_id = $1
            ORDER BY fecha DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async create(data: CreatePrescriptionDTO): Promise<Prescription> {
        const dataToHash = JSON.stringify({
            patientId: data.patientId,
            medications: data.medications,
            date: new Date().toISOString()
        });
        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        const query = `
            INSERT INTO recetas (
                paciente_id, profesional_id, historia_id, medicamentos, data_hash
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id, paciente_id as "patientId", profesional_id as "professionalId",
                historia_id as "clinicalRecordId", fecha as "date",
                medicamentos as "medications", estado as "status",
                data_hash as "data_hash"
        `;
        const values = [
            data.patientId, data.professionalId, data.clinicalRecordId,
            JSON.stringify(data.medications), hash
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}
