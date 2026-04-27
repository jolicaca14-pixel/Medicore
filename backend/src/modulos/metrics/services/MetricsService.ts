import pool from '../../../config/database';

export class MetricsService {
    static async getSystemMetrics() {
        // Total pacientes
        const patientsCount = await pool.query('SELECT COUNT(*) FROM pacientes');

        // Total historias finalizadas
        const recordsCount = await pool.query("SELECT COUNT(*) FROM historias_clinicas WHERE status = 'FINALIZED'");

        // Recaudo total (facturas pagadas o todas si son borradores para métrica de expectativa)
        const revenueResult = await pool.query('SELECT SUM(valor_total) FROM facturas');

        // Auditoría reciente
        const recentAudit = await pool.query(
            `SELECT a.*, u.nombre_completo
             FROM auditoria a
             JOIN usuarios u ON a.usuario_id = u.id
             ORDER BY a.created_at DESC
             LIMIT 5`
        );

        return {
            totalPatients: parseInt(patientsCount.rows[0].count),
            finalizedRecords: parseInt(recordsCount.rows[0].count),
            totalRevenue: parseFloat(revenueResult.rows[0].sum || 0),
            recentAudit: recentAudit.rows
        };
    }
}
