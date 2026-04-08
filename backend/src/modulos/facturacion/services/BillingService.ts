import pool from '../../../config/database';

export interface InvoiceDetail {
    descripcion: string;
    cantidad: number;
    valor_unitario: number;
    codigo_cups?: string;
}

export interface Invoice {
    id?: string;
    paciente_id: string;
    profesional_id?: string;
    historia_clinica_id?: string;
    total: number;
    estado: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
    metodo_pago?: string;
    observaciones?: string;
    detalles: InvoiceDetail[];
}

export class BillingService {
    static async createInvoice(data: Invoice): Promise<Invoice> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const invoiceRes = await client.query(
                `INSERT INTO facturas (paciente_id, profesional_id, historia_clinica_id, total, estado, metodo_pago, observaciones)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [data.paciente_id, data.profesional_id, data.historia_clinica_id, data.total, data.estado, data.metodo_pago, data.observaciones]
            );

            const invoiceId = invoiceRes.rows[0].id;

            for (const detail of data.detalles) {
                await client.query(
                    `INSERT INTO detalles_factura (factura_id, descripcion, cantidad, valor_unitario, valor_total, codigo_cups)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [invoiceId, detail.descripcion, detail.cantidad, detail.valor_unitario, detail.cantidad * detail.valor_unitario, detail.codigo_cups]
                );
            }

            await client.query('COMMIT');
            return { ...invoiceRes.rows[0], detalles: data.detalles };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    static async getInvoicesByPatient(patientId: string): Promise<any[]> {
        const query = `
            SELECT f.*,
            (SELECT json_agg(d) FROM detalles_factura d WHERE d.factura_id = f.id) as detalles
            FROM facturas f
            WHERE f.paciente_id = $1
            ORDER BY f.created_at DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async updateStatus(id: string, estado: string, metodo_pago?: string): Promise<any> {
        const query = `
            UPDATE facturas
            SET estado = $2, metodo_pago = COALESCE($3, metodo_pago),
                date_paid = CASE WHEN $2 = 'PAID' THEN NOW() ELSE date_paid END,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id, estado, metodo_pago]);
        return result.rows[0];
    }
}
