import pool from '../../../config/database';
import { RipsUser, RipsConsultation } from '../types';

export class RipsService {
    static async generateUS(startDate: string, endDate: string): Promise<string> {
        // Obtener usuarios atendidos en el rango de fechas
        const result = await pool.query(
            `SELECT DISTINCT p.*
             FROM pacientes p
             JOIN historias_clinicas h ON p.id = h.paciente_id
             WHERE h.fecha_finalizacion BETWEEN $1 AND $2`,
            [startDate, endDate]
        );

        return result.rows.map(p => {
            const names = p.nombre_completo.split(' ');
            const primerApellido = names[0] || '';
            const segundoApellido = names[1] || '';
            const primerNombre = names[2] || '';
            const segundoNombre = names.slice(3).join(' ') || '';

            const birth = new Date(p.fecha_nacimiento);
            const now = new Date();
            const age = now.getFullYear() - birth.getFullYear();

            return [
                p.tipo_identificacion || 'CC',
                p.identificacion,
                '1', // Regimen (1: Contributivo, 2: Subsidiado) - Mock
                primerApellido,
                segundoApellido,
                primerNombre,
                segundoNombre,
                age,
                '1', // Unidad medida edad (1: Años)
                p.genero,
                '05', // Depto - Mock
                '001', // Mun - Mock
                'U' // Zona (U: Urbana)
            ].join(',');
        }).join('\n');
    }

    static async generateAC(startDate: string, endDate: string): Promise<string> {
        // Obtener consultas finalizadas en el rango
        const result = await pool.query(
            `SELECT h.*, p.identificacion, p.tipo_identificacion
             FROM historias_clinicas h
             JOIN pacientes p ON h.paciente_id = p.id
             WHERE h.status = 'FINALIZED' AND h.fecha_finalizacion BETWEEN $1 AND $2`,
            [startDate, endDate]
        );

        return result.rows.map(h => {
            const diagPrincipal = h.diagnoses?.[0]?.code || '';
            const diagRel1 = h.diagnoses?.[1]?.code || '';

            return [
                'FAC-001', // Num factura - Mock
                '1234567890', // Cod prestador - Mock
                h.tipo_identificacion,
                h.identificacion,
                h.fecha_finalizacion.toISOString().split('T')[0],
                '', // Num autorizacion
                '890201', // Cod consulta (CUPS) - Mock
                '10', // Finalidad (10: No aplica)
                '13', // Causa externa (13: Enfermedad general)
                diagPrincipal,
                diagRel1,
                '', '', // Diag rel 2, 3
                '1', // Tipo diag (1: Impresion diagnostica)
                '45000', // Valor
                '0', // Cuota
                '45000' // Neto
            ].join(',');
        }).join('\n');
    }
}
