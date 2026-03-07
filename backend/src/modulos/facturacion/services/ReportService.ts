import pool from '../../../config/database';

export class ReportService {
    static async getDailyClosing(date: string) {
        const query = `
            SELECT
                COUNT(*) as total_invoices,
                SUM(total) as gross_revenue,
                SUM(total - saldo) as collected_revenue,
                SUM(saldo) as outstanding_balance
            FROM facturas
            WHERE DATE(fecha) = $1
        `;
        const result = await pool.query(query, [date]);

        const paymentsQuery = `
            SELECT metodo, SUM(monto) as total
            FROM pagos
            WHERE DATE(fecha) = $1
            GROUP BY metodo
        `;
        const paymentsResult = await pool.query(paymentsQuery, [date]);

        return {
            summary: result.rows[0],
            byMethod: paymentsResult.rows
        };
    }

    static async getProfessionalProductivity(startDate: string, endDate: string) {
        const query = `
            SELECT
                profesional_nombre,
                profesional_id,
                COUNT(*) as total_records,
                COUNT(*) FILTER (WHERE estado = 'FINALIZED') as finalized_records
            FROM historias_clinicas
            WHERE fecha_creacion BETWEEN $1 AND $2
            GROUP BY profesional_id, profesional_nombre
        `;
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows;
    }
}
