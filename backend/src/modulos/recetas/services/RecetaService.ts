import pool from '../../../config/database';
import { CreateRecetaDTO, Receta } from '../types';

export class RecetaService {
    static async create(data: CreateRecetaDTO): Promise<Receta> {
        const result = await pool.query(
            `INSERT INTO recetas (paciente_id, profesional_id, historia_clinica_id, items)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [data.pacienteId, data.profesionalId, data.historiaClinicaId, JSON.stringify(data.items)]
        );
        return result.rows[0];
    }

    static async getByPatientId(patientId: string): Promise<Receta[]> {
        const result = await pool.query(
            'SELECT * FROM recetas WHERE paciente_id = $1 ORDER BY fecha DESC',
            [patientId]
        );
        return result.rows;
    }

    static async getById(id: string): Promise<Receta | undefined> {
        const result = await pool.query('SELECT * FROM recetas WHERE id = $1', [id]);
        return result.rows[0];
    }
}
