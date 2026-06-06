import pool from '../../../config/database';

export class RIPSService {
    static async generateUS() {
        const query = `SELECT identificacion, tipo_identificacion, nombre_completo, genero, fecha_nacimiento FROM pacientes`;
        const result = await pool.query(query);

        // CSV format for US (Users)
        let csv = "TipoDoc,ID,Nombre,Genero,FechaNacimiento\n";
        result.rows.forEach(row => {
            csv += `${row.tipo_identificacion},${row.identificacion},${row.nombre_completo},${row.genero},${row.fecha_nacimiento.toISOString().split('T')[0]}\n`;
        });
        return csv;
    }

    static async generateAC() {
        const query = `
            SELECT h.id, p.identificacion, h.fecha_creacion, h.diagnosticos, h.procedimientos_realizados
            FROM historias_clinicas h
            JOIN pacientes p ON h.paciente_id = p.id
            WHERE h.estado = 'FINALIZED'
        `;
        const result = await pool.query(query);

        // CSV format for AC (Consultations)
        let csv = "ID_Paciente,Fecha,CIE11_Principal,CUPS\n";
        result.rows.forEach(row => {
            const principalDiag = row.diagnosticos.find((d: any) => d.type === 'PRINCIPAL')?.code || '';
            const cups = row.procedimientos_realizados.map((p: any) => p.code).join('|');
            csv += `${row.identificacion},${row.fecha_creacion.toISOString().split('T')[0]},${principalDiag},${cups}\n`;
        });
        return csv;
    }
}
