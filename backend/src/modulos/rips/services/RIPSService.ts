import pool from '../../../config/database';

export class RIPSService {
    static async generateUS(startDate: string, endDate: string): Promise<string> {
        const query = `
            SELECT DISTINCT
                p.tipo_identificacion as "tipo_id",
                p.identificacion as "id",
                'EPS001' as "codigo_admin",
                '1' as "tipo_usuario",
                split_part(p.nombre_completo, ' ', 2) as "apellido1",
                '' as "apellido2",
                split_part(p.nombre_completo, ' ', 1) as "nombre1",
                '' as "nombre2",
                EXTRACT(YEAR FROM age(p.fecha_nacimiento)) as "edad",
                '1' as "unidad_edad",
                p.genero as "sexo",
                '11' as "depto",
                '001' as "muni",
                'U' as "zona"
            FROM pacientes p
            JOIN historias_clinicas h ON p.id = h.paciente_id
            WHERE h.fecha_finalizada BETWEEN $1 AND $2
        `;
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows.map(r => Object.values(r).join(',')).join('\n');
    }

    static async generateAC(startDate: string, endDate: string): Promise<string> {
        const query = `
            SELECT
                f.numero_factura,
                '1100100001' as "codigo_prestador",
                p.tipo_identificacion,
                p.identificacion,
                to_char(h.fecha_finalizada, 'DD/MM/YYYY') as "fecha",
                'AUT-000' as "autorizacion",
                '890201' as "cups",
                '10' as "finalidad",
                '13' as "causa",
                COALESCE((h.diagnosticos->0->>'code'), 'Z000') as "dx",
                '', '', '',
                '1' as "tipo_dx",
                '45000' as "valor",
                '4500' as "copago",
                '40500' as "neto"
            FROM historias_clinicas h
            JOIN pacientes p ON h.paciente_id = p.id
            LEFT JOIN facturas f ON h.id = f.historia_id
            WHERE h.fecha_finalizada BETWEEN $1 AND $2
            AND h.estado = 'FINALIZED'
        `;
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows.map(r => Object.values(r).join(',')).join('\n');
    }
}
