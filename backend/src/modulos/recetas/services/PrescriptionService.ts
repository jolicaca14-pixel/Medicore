import pool from '../../../config/database';
import { CreatePrescriptionDTO, Prescription } from '../types';
import crypto from 'crypto';

export class PrescriptionService {
    async getPrescriptionsByPatient(paciente_id: string): Promise<Prescription[]> {
        const result = await pool.query(
            'SELECT * FROM recetas WHERE paciente_id = $1 ORDER BY created_at DESC',
            [paciente_id]
        );
        return result.rows;
    }

    async getPrescriptionById(id: string): Promise<Prescription> {
        const result = await pool.query('SELECT * FROM recetas WHERE id = $1', [id]);
        return result.rows[0];
    }

    async createPrescription(data: CreatePrescriptionDTO): Promise<Prescription> {
        const { historia_id, paciente_id, profesional_id, medicamentos, diagnostico_cie11 } = data;

        // 🛡️ MORPHEUS: Generate security hash for data integrity
        const prescriptionContent = JSON.stringify({ historia_id, paciente_id, profesional_id, medicamentos, diagnostico_cie11 });
        const hash = crypto.createHash('sha256').update(prescriptionContent).digest('hex');

        const result = await pool.query(
            `INSERT INTO recetas (historia_id, paciente_id, profesional_id, medicamentos, diagnostico_cie11, hash_seguridad)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [historia_id, paciente_id, profesional_id, JSON.stringify(medicamentos), diagnostico_cie11, hash]
        );

        return result.rows[0];
    }

    async updatePdfPath(id: string, path: string): Promise<void> {
        await pool.query('UPDATE recetas SET ruta_pdf_generado = $1, updated_at = NOW() WHERE id = $2', [path, id]);
    }

    async setSecurityHash(id: string, hash: string): Promise<void> {
        await pool.query('UPDATE recetas SET hash_seguridad = $1, updated_at = NOW() WHERE id = $2', [hash, id]);
    }
}

export default new PrescriptionService();
