import pool from '../../../config/database';

export class BillingService {
    static async createInvoiceFromRecord(recordId: string): Promise<any> {
        // Obtener la historia clínica y el paciente
        const recordResult = await pool.query(
            `SELECT h.*, p.id as "paciente_id"
             FROM historias_clinicas h
             JOIN pacientes p ON h.paciente_id = p.id
             WHERE h.id = $1`,
            [recordId]
        );

        if (recordResult.rows.length === 0) throw new Error('Historia no encontrada');
        const record = recordResult.rows[0];

        // Calcular valor total basado en procedimientos (Mock: 45000 por proc)
        const procedures = record.performed_procedures || [];
        const baseValue = 45000;
        const total = procedures.length > 0 ? procedures.length * baseValue : baseValue;

        const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;

        const result = await pool.query(
            `INSERT INTO facturas (numero_factura, paciente_id, historia_clinica_id, valor_total, detalle)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [invoiceNumber, record.paciente_id, recordId, total, JSON.stringify(procedures)]
        );

        console.log(`[BILLING] Draft invoice ${invoiceNumber} created for record ${recordId}`);
        return result.rows[0];
    }

    static async getAllInvoices() {
        const result = await pool.query(
            `SELECT f.*, p.nombre_completo as "paciente_nombre", p.identificacion as "paciente_id_num"
             FROM facturas f
             JOIN pacientes p ON f.paciente_id = p.id
             ORDER BY f.created_at DESC`
        );
        return result.rows;
    }
}
