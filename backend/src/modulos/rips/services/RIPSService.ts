import pool from '../../../config/database';

export class RIPSService {
    /**
     * 🔮 THE ORACLE: Generate US (Users) RIPS file
     * Format: Comma-separated values according to MinSalud standards.
     */
    async generateUS(): Promise<string> {
        const result = await pool.query('SELECT * FROM pacientes');
        const rows = result.rows.map(p => {
            return `${p.tipo_identificacion || 'CC'},${p.identificacion},EPS001,1,${p.nombre_completo},,,${p.fecha_nacimiento},${p.genero},05,001,U`;
        });
        return rows.join('\n');
    }

    /**
     * 🔮 THE ORACLE: Generate AC (Consultations) RIPS file
     */
    async generateAC(): Promise<string> {
        // This is a simplified mock for demo purposes, joining invoices/clinical records
        const result = await pool.query('SELECT * FROM facturas WHERE estado = \'PAGADA\'');
        const rows = result.rows.map(f => {
            return `FAC${f.id.slice(0,5)},05001,CC,1098765432,${f.fecha_emision},AUTORIZ01,890201,1,1,Z000,${f.total},0,${f.total}`;
        });
        return rows.join('\n');
    }
}

export default new RIPSService();
