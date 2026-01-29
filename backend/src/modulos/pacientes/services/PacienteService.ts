import pool from '../../../config/database';

class PacienteService {
    public async getAll() {
        try {
            const result = await pool.query('SELECT * FROM pacientes ORDER BY full_name ASC');
            return result.rows;
        } catch (error) {
            console.error('Error in PacienteService.getAll:', error);
            // Fallback for development if table doesn't exist yet
            return [];
        }
    }

    public async getById(id: string) {
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
        return result.rows[0];
    }

    public async create(data: any) {
        const { identification, full_name, birth_date, gender, insurance_type, allergies, blood_type, rh_factor } = data;
        const result = await pool.query(
            'INSERT INTO pacientes (identification, full_name, birth_date, gender, insurance_type, allergies, blood_type, rh_factor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [identification, full_name, birth_date, gender, insurance_type, allergies, blood_type, rh_factor]
        );
        return result.rows[0];
    }
}

export default new PacienteService();
