import pool from '../../../config/database';

export class RipsService {
    /**
     * Generates US (Usuarios) file content
     * Standard: TipoIdentificacion, Identificacion, EPS_Code, UserType, LastName1, LastName2, FirstName1, FirstName2, Age, AgeUnit, Gender, Dept, Mun, Zone
     */
    static async generateUS(): Promise<string> {
        const query = `
            SELECT
                tipo_identificacion, identificacion, tipo_aseguradora,
                nombre_completo, fecha_nacimiento, genero
            FROM pacientes
        `;
        const result = await pool.query(query);

        let content = '';
        for (const p of result.rows) {
            const names = p.nombre_completo.split(' ');
            const firstName = names[0] || '';
            const secondName = names.length > 2 ? names[1] : '';
            const lastName1 = names.length > 2 ? names[names.length - 2] : names[names.length - 1] || '';
            const lastName2 = names.length > 2 ? names[names.length - 1] : '';

            // Calc age
            const age = Math.floor((new Date().getTime() - new Date(p.fecha_nacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

            content += `${p.tipo_identificacion},${p.identificacion},EPS001,1,${lastName1},${lastName2},${firstName},${secondName},${age},1,${p.genero},05,001,U\r\n`;
        }
        return content;
    }

    /**
     * Generates AC (Consultas) file content
     * Standard: InvoiceNum, ProviderCode, TipoId, Id, Date, AuthNum, ProcedureCode, Purpose, Diagnosis, DiagRel1, DiagRel2, DiagRel3, DiagType, Value, Copay, Total
     */
    static async generateAC(): Promise<string> {
        const query = `
            SELECT
                hc.id, hc.paciente_id, hc.diagnosticos, hc.date_finalized,
                p.tipo_identificacion, p.identificacion, hc.tipo_registro
            FROM historias_clinicas hc
            JOIN pacientes p ON hc.paciente_id = p.id
            WHERE hc.estado = 'FINALIZED'
        `;
        const result = await pool.query(query);

        let content = '';
        for (const r of result.rows) {
            const date = new Date(r.date_finalized).toLocaleDateString('es-CO').replace(/\//g, '');
            const diag = (r.diagnosticos && r.diagnosticos[0]?.code) || 'Z000';

            content += `FAC001,001,${r.tipo_identificacion},${r.identificacion},${date},,890201,1,${diag},,,,1,50000,0,50000\r\n`;
        }
        return content;
    }
}
