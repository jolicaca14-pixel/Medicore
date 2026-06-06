import pool from '../../../config/database';
import { CreateInvoiceDTO, Invoice } from '../types';

export class FacturacionService {
    static async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
        const total = data.items.reduce((acc, item) => acc + item.subtotal, 0);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const invoiceResult = await client.query(
                `INSERT INTO facturas (paciente_id, historia_id, total, estado)
                 VALUES ($1, $2, $3, 'DRAFT')
                 RETURNING id, paciente_id as "patientId", historia_id as "clinicalRecordId", fecha as "date", total, estado as "status"`,
                [data.patientId, data.clinicalRecordId, total]
            );

            const invoiceId = invoiceResult.rows[0].id;

            for (const item of data.items) {
                await client.query(
                    `INSERT INTO detalles_factura (factura_id, descripcion, cantidad, precio_unitario, subtotal, codigo_cups)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [invoiceId, item.description, item.quantity, item.unitPrice, item.subtotal, item.code]
                );
            }

            await client.query('COMMIT');

            return {
                ...invoiceResult.rows[0],
                items: data.items
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getByPatientId(patientId: string): Promise<Invoice[]> {
        const query = `
            SELECT
                id, paciente_id as "patientId", historia_id as "clinicalRecordId",
                fecha as "date", total, estado as "status"
            FROM facturas
            WHERE paciente_id = $1
            ORDER BY fecha DESC
        `;
        const result = await pool.query(query, [patientId]);

        const invoices = [];
        for (const row of result.rows) {
            const itemsResult = await pool.query(
                `SELECT descripcion as "description", cantidad as "quantity",
                        precio_unitario as "unitPrice", subtotal, codigo_cups as "code"
                 FROM detalles_factura WHERE factura_id = $1`,
                [row.id]
            );
            invoices.push({
                ...row,
                items: itemsResult.rows
            });
        }
        return invoices;
    }
}
