import pool from '../../../config/database';
import { Invoice, InvoiceStatus } from '../types';

export class FacturacionService {
    static async generateFromClinicalRecord(recordId: string): Promise<Invoice | null> {
        const recordResult = await pool.query('SELECT * FROM historias_clinicas WHERE id = $1', [recordId]);
        if (recordResult.rows.length === 0) return null;

        const record = recordResult.rows[0];
        const procedures = record.procedimientos_realizados || [];

        if (procedures.length === 0) return null;

        const items = procedures.map((p: any) => ({
            description: p.description || p.name,
            code: p.code,
            quantity: 1,
            unitPrice: p.price || 50000, // Default price if not provided
            total: p.price || 50000
        }));

        const totalAmount = items.reduce((sum: number, item: any) => sum + item.total, 0);

        const result = await pool.query(
            `INSERT INTO facturas (paciente_id, clinical_record_id, total_amount, estado, items)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [record.paciente_id, recordId, totalAmount, InvoiceStatus.DRAFT, JSON.stringify(items)]
        );

        return this.mapToCamelCase(result.rows[0]);
    }

    static async getAllInvoices(): Promise<Invoice[]> {
        const result = await pool.query('SELECT * FROM facturas ORDER BY created_at DESC');
        return result.rows.map(this.mapToCamelCase);
    }

    private static mapToCamelCase(row: any): Invoice {
        return {
            id: row.id,
            patientId: row.paciente_id,
            clinicalRecordId: row.clinical_record_id,
            date: row.created_at,
            totalAmount: row.total_amount,
            status: row.estado,
            items: row.items
        };
    }
}
