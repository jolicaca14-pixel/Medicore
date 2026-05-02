import pool from '../../../config/database';

export class RIPSService {
    static async generateUS(invoiceIds: string[]): Promise<string> {
        // US: Usuarios de los servicios de salud
        // identificationType, identificationNumber, epsCode, userType, lastName1, lastName2, firstName1, firstName2, age, ageUnit, gender, department, municipality, zone

        const query = `
            SELECT DISTINCT p.*
            FROM pacientes p
            JOIN facturas f ON f.paciente_id = p.id
            WHERE f.id = ANY($1)
        `;
        const result = await pool.query(query, [invoiceIds]);

        let content = '';
        for (const p of result.rows) {
            const age = this.calculateAge(p.fecha_nacimiento);
            const line = `${p.tipo_identificacion},${p.identificacion},EPS001,1,${p.nombre_completo.split(' ')[0]},,${p.nombre_completo.split(' ').slice(1).join(' ')},,${age},1,${p.genero},05,001,U\r\n`;
            content += line;
        }
        return content;
    }

    static async generateAC(invoiceIds: string[]): Promise<string> {
        // AC: Consulta
        // invoiceNumber, providerCode, idType, idNumber, date, authNumber, procCode, purpose, cause, diagMain, diagRel1, diagRel2, diagRel3, diagType, value, copay, netValue

        const query = `
            SELECT f.*, p.identificacion, p.tipo_identificacion, h.diagnosticos, h.fecha_creacion
            FROM facturas f
            JOIN pacientes p ON f.paciente_id = p.id
            JOIN historias_clinicas h ON f.clinical_record_id = h.id
            WHERE f.id = ANY($1)
        `;
        const result = await pool.query(query, [invoiceIds]);

        let content = '';
        for (const f of result.rows) {
            const date = new Date(f.fecha_creacion).toLocaleDateString('es-CO');
            const items = f.items || [];
            const diag = (f.diagnosticos && f.diagnosticos[0]) ? f.diagnosticos[0].code : 'Z000';

            for (const item of items) {
                const line = `${f.id.slice(0,8)},000001,${f.tipo_identificacion},${f.identificacion},${date},,${item.code},1,1,${diag},,,,1,${item.total},0,${item.total}\r\n`;
                content += line;
            }
        }
        return content;
    }

    private static calculateAge(birthDate: string): number {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
}
