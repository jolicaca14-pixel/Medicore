import pool from '../../../config/database';
import { CreateDiagnosticDTO, DiagnosticResult } from '../types';

export class DiagnosticService {
    static async create(data: CreateDiagnosticDTO): Promise<DiagnosticResult> {
        const result = await pool.query(
            `INSERT INTO resultados_diagnosticos (paciente_id, profesional_id, tipo, nombre_examen, estado)
             VALUES ($1, $2, $3, $4, 'PENDIENTE')
             RETURNING *`,
            [data.pacienteId, data.profesionalId, data.tipo, data.nombreExamen]
        );
        return result.rows[0];
    }

    static async getByPatientId(patientId: string): Promise<DiagnosticResult[]> {
        const result = await pool.query(
            'SELECT * FROM resultados_diagnosticos WHERE paciente_id = $1 ORDER BY fecha_solicitud DESC',
            [patientId]
        );
        return result.rows;
    }

    static async validateResult(id: string, specialistId: string, resultData: any): Promise<DiagnosticResult> {
        const { resultado_texto, url_adjunto } = resultData;
        const result = await pool.query(
            `UPDATE resultados_diagnosticos SET
                especialista_id = $1, resultado_texto = $2, url_adjunto = $3,
                estado = 'VALIDADO', fecha_resultado = NOW(), updated_at = NOW()
             WHERE id = $4 RETURNING *`,
            [specialistId, resultado_texto, url_adjunto, id]
        );
        return result.rows[0];
    }
}
