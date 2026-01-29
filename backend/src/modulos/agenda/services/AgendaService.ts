import pool from '../../../config/database';

class AgendaService {
    public async getAll(professionalId?: string) {
        let query = 'SELECT * FROM citas';
        const params = [];
        if (professionalId) {
            query += ' WHERE professional_id = $1';
            params.push(professionalId);
        }
        query += ' ORDER BY date ASC, time ASC';
        const result = await pool.query(query, params);
        return result.rows;
    }

    public async create(data: any) {
        const { patient_id, professional_id, date, time, reason } = data;
        const result = await pool.query(
            'INSERT INTO citas (patient_id, professional_id, date, time, reason, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [patient_id, professional_id, date, time, reason, 'SCHEDULED']
        );
        return result.rows[0];
    }
}

export default new AgendaService();
