import pool from '../../../config/database';

export class FacturacionService {
    static async generateFromClinicalRecord(recordId: string): Promise<any> {
        // 1. Get Clinical Record details
        const recordQuery = 'SELECT * FROM historias_clinicas WHERE id = $1';
        const recordResult = await pool.query(recordQuery, [recordId]);
        if (recordResult.rows.length === 0) throw new Error("Historia no encontrada");
        const record = recordResult.rows[0];

        // 2. Get Patient details (for insurance)
        const patientQuery = 'SELECT tipo_aseguradora FROM pacientes WHERE id = $1';
        const patientResult = await pool.query(patientQuery, [record.paciente_id]);
        const patient = patientResult.rows[0];

        // 3. Create Factura Header
        const invoiceNumber = `FAC-${Date.now().toString().slice(-6)}`;
        const invoiceQuery = `
            INSERT INTO facturas (paciente_id, historia_id, numero_factura, entidad_pagadora, estado)
            VALUES ($1, $2, $3, $4, 'DRAFT')
            RETURNING *
        `;
        const invoiceResult = await pool.query(invoiceQuery, [
            record.paciente_id, record.id, invoiceNumber, patient.tipo_aseguradora || 'PARTICULAR'
        ]);
        const invoice = invoiceResult.rows[0];

        // 4. Create Details (Consultation + Procedures)
        let totalVal = 0;

        // Base Consult (Mock logic based on type)
        const basePrice = record.tipo_registro === 'PROCEDURE' ? 0 : 45000;
        if (basePrice > 0) {
            await pool.query(`
                INSERT INTO detalles_factura (factura_id, codigo_servicio, descripcion, valor_unitario, valor_total)
                VALUES ($1, $2, $3, $4, $5)
            `, [invoice.id, 'CONS-01', `Consulta ${record.tipo_registro}`, basePrice, basePrice]);
            totalVal += basePrice;
        }

        // Procedures
        if (record.diagnosticos && Array.isArray(record.diagnosticos)) {
            // Simplified: for this demo, we assume procedures are stored in a specific field or derived
            // In a real app we would iterate record.performedProcedures
        }

        // 5. Update Total
        await pool.query('UPDATE facturas SET valor_total = $1 WHERE id = $2', [totalVal, invoice.id]);

        return { ...invoice, valor_total: totalVal };
    }

    static async getByPatientId(patientId: string): Promise<any[]> {
        const query = 'SELECT * FROM facturas WHERE paciente_id = $1 ORDER BY fecha_emision DESC';
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }
}
