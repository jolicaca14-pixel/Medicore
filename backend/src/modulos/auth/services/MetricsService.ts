import pool from '../../../config/database';

export class MetricsService {
    static async getOverviewMetrics() {
        const patientsCount = await pool.query('SELECT COUNT(*) FROM pacientes');
        const recordsCount = await pool.query('SELECT COUNT(*) FROM historias_clinicas');
        const revenueCount = await pool.query('SELECT SUM(total_amount) FROM facturas WHERE estado = \'PAID\'');
        const recentAudit = await pool.query('SELECT * FROM auditoria ORDER BY created_at DESC LIMIT 5');

        return {
            totalPatients: parseInt(patientsCount.rows[0].count),
            totalRecords: parseInt(recordsCount.rows[0].count),
            totalRevenue: parseFloat(revenueCount.rows[0].sum || '0'),
            recentActivity: recentAudit.rows
        };
    }
}
