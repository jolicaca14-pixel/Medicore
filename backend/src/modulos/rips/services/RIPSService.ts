import pool from '../../../config/database';

export class RIPSService {
    /**
     * Genera el archivo US (Usuarios)
     */
    static async generateUS(): Promise<string> {
        const query = 'SELECT * FROM pacientes';
        const result = await pool.query(query);

        return result.rows.map(p => {
            const birthDate = new Date(p.fecha_nacimiento);
            const formattedBirth = `${birthDate.getDate().toString().padStart(2, '0')}/${(birthDate.getMonth() + 1).toString().padStart(2, '0')}/${birthDate.getFullYear()}`;

            return [
                p.tipo_identificacion || 'CC',
                p.identificacion,
                'EPS001', // Código EPS hardcoded para demo
                '1', // Tipo usuario
                p.nombre_completo.split(' ')[0] || '',
                p.nombre_completo.split(' ')[1] || '',
                p.nombre_completo.split(' ')[2] || '',
                p.nombre_completo.split(' ')[3] || '',
                '30', // Edad
                '1', // Unidad medida edad (Años)
                p.genero || 'F',
                '05', // Depto
                '001', // Municipio
                'U' // Zona
            ].join(',');
        }).join('\n');
    }

    /**
     * Genera el archivo AC (Consultas)
     */
    static async generateAC(): Promise<string> {
        const query = `
            SELECT hc.*, p.identificacion, p.tipo_identificacion
            FROM historias_clinicas hc
            JOIN pacientes p ON hc.paciente_id = p.id
            WHERE hc.status = 'FINALIZED'
        `;
        const result = await pool.query(query);

        return result.rows.map(hc => {
            const date = new Date(hc.date_finalized);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

            return [
                'FAC001', // Factura
                'PRV001', // Prestador
                hc.tipo_identificacion || 'CC',
                hc.identificacion,
                formattedDate,
                'AUT001', // Autorización
                '890201', // Código CUPS (Consulta general demo)
                '1', // Finalidad
                '1', // Causa externa
                hc.diagnoses?.[0]?.code || 'Z000', // DX Principal
                '', '', '', // DX Relacionados
                '1', // Tipo DX
                '50000', // Valor
                '0', // Cuota
                '50000' // Neto
            ].join(',');
        }).join('\n');
    }
}
