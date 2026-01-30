import pool from '../../../config/database';

export class PatientService {
    async getAllPatients() {
        const result = await pool.query('SELECT * FROM pacientes ORDER BY nombre_completo ASC');
        return result.rows;
    }

    async getPatientByIdentification(identificacion: string) {
        const result = await pool.query('SELECT * FROM pacientes WHERE identificacion = $1', [identificacion]);
        return result.rows[0];
    }

    async createPatient(patientData: any) {
        const { nombre_completo, identificacion, tipo_identificacion, fecha_nacimiento, genero, email, telefono, tipo_aseguradora, alergias } = patientData;

        const result = await pool.query(
            `INSERT INTO pacientes (nombre_completo, identificacion, tipo_identificacion, fecha_nacimiento, genero, email, telefono, tipo_aseguradora, alergias)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [nombre_completo, identificacion, tipo_identificacion || 'CC', fecha_nacimiento, genero, email, telefono, tipo_aseguradora, alergias]
        );

        return result.rows[0];
    }
}

export default new PatientService();
