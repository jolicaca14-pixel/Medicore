import pool from '../../../config/database';

export class MetricsService {
    static async getSystemStats() {
        const patientsCount = await pool.query('SELECT COUNT(*) FROM pacientes');
        const recordsCount = await pool.query('SELECT COUNT(*) FROM historias_clinicas');
        const billingStats = await pool.query("SELECT SUM(total) as revenue FROM facturas WHERE estado = 'PAID'");
        const pendingBilling = await pool.query("SELECT SUM(total) as pending FROM facturas WHERE estado != 'PAID' AND estado != 'CANCELLED'");

        const recentAudits = await pool.query(`
            SELECT a.*, u.nombre_completo as usuario
            FROM auditoria a
            LEFT JOIN usuarios u ON a.usuario_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 5
        `);

        return {
            patients: parseInt(patientsCount.rows[0].count),
            records: parseInt(recordsCount.rows[0].count),
            revenue: parseFloat(billingStats.rows[0].revenue || 0),
            pendingRevenue: parseFloat(pendingBilling.rows[0].pending || 0),
            recentAudits: recentAudits.rows
        };
    }
}
