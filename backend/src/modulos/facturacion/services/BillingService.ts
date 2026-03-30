import pool from '../../../config/database';
import { Invoice, InvoiceStatus, InvoiceItem } from '../types';

export class BillingService {
    static async createInvoice(data: Partial<Invoice>, items: Partial<InvoiceItem>[]): Promise<Invoice> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const invoiceNumber = `FAC-${Date.now()}`;
            const subtotal = items.reduce((sum, item) => sum + (Number(item.valor_total) || 0), 0);
            const total = subtotal; // Simplicidad: sin impuestos por ahora

            const invoiceQuery = `
                INSERT INTO facturas (paciente_id, hce_id, numero_factura, subtotal, total, estado, notas)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const invoiceResult = await client.query(invoiceQuery, [
                data.paciente_id, data.hce_id, invoiceNumber, subtotal, total, InvoiceStatus.DRAFT, data.notas
            ]);

            const invoice = invoiceResult.rows[0];

            for (const item of items) {
                const itemQuery = `
                    INSERT INTO detalles_factura (factura_id, descripcion, codigo_servicio, cantidad, valor_unitario, valor_total)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;
                await client.query(itemQuery, [
                    invoice.id, item.descripcion, item.codigo_servicio, item.cantidad, item.valor_unitario, item.valor_total
                ]);
            }

            await client.query('COMMIT');
            return { ...invoice, items };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getInvoicesByPatient(patientId: string): Promise<Invoice[]> {
        const query = 'SELECT * FROM facturas WHERE paciente_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }
}
