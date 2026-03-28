import { pool } from '../../../config/database';

export interface Invoice {
    id: string;
    paciente_id: string;
    profesional_id?: string;
    cita_id?: string;
    fecha_emision: string;
    estado: 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE';
    subtotal: number;
    total: number;
    saldo_pendiente: number;
    servicios: any[];
}

export class BillingService {
    static async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
        const query = `
            INSERT INTO facturas (paciente_id, profesional_id, cita_id, subtotal, total, saldo_pendiente, servicios)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const result = await pool.query(query, [
            data.paciente_id,
            data.profesional_id,
            data.cita_id,
            data.subtotal,
            data.total,
            data.total, // Saldo inicial es el total
            JSON.stringify(data.servicios || [])
        ]);
        return result.rows[0];
    }

    static async getInvoicesByPatient(patientId: string): Promise<Invoice[]> {
        const result = await pool.query('SELECT * FROM facturas WHERE paciente_id = $1 ORDER BY fecha_emision DESC', [patientId]);
        return result.rows;
    }

    static async registerPayment(invoiceId: string, amount: number, method: string, userId: string): Promise<any> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Registrar pago
            await client.query(
                'INSERT INTO pagos (factura_id, monto, metodo_pago, usuario_recibe) VALUES ($1, $2, $3, $4)',
                [invoiceId, amount, method, userId]
            );

            // 2. Actualizar saldo factura
            const updateRes = await client.query(
                'UPDATE facturas SET saldo_pendiente = saldo_pendiente - $1 WHERE id = $2 RETURNING saldo_pendiente',
                [amount, invoiceId]
            );

            const newBalance = updateRes.rows[0].saldo_pendiente;
            if (newBalance <= 0) {
                await client.query('UPDATE facturas SET estado = \'PAID\' WHERE id = $1', [invoiceId]);
            }

            await client.query('COMMIT');
            return { invoiceId, newBalance };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}
