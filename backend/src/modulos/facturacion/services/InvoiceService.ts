import pool from '../../../config/database';
import { Invoice, Payment } from '../types';

export class InvoiceService {
    static async getAll(): Promise<Invoice[]> {
        const query = `
            SELECT f.*,
                   COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as payments
            FROM facturas f
            LEFT JOIN pagos p ON f.id = p.factura_id
            GROUP BY f.id
            ORDER BY f.fecha DESC
        `;
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToInvoice(row));
    }

    static async getById(id: string): Promise<Invoice | undefined> {
        const query = `
            SELECT f.*,
                   COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as payments
            FROM facturas f
            LEFT JOIN pagos p ON f.id = p.factura_id
            WHERE f.id = $1
            GROUP BY f.id
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return undefined;
        return this.mapRowToInvoice(result.rows[0]);
    }

    static async create(data: Partial<Invoice>): Promise<Invoice> {
        const numeroFactura = data.numeroFactura || `INV-${Date.now()}`;
        const query = `
            INSERT INTO facturas (
                numero_factura, paciente_id, paciente_nombre, items,
                subtotal, descuento, total, saldo, tipo_pagador, estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const values = [
            numeroFactura,
            data.patientId,
            data.patientName,
            JSON.stringify(data.items || []),
            data.subtotal,
            data.discount || 0,
            data.total,
            data.balance,
            data.payerType,
            data.status || 'PENDING'
        ];
        const result = await pool.query(query, values);
        return this.mapRowToInvoice(result.rows[0]);
    }

    static async addPayment(facturaId: string, amount: number, method: string): Promise<Payment> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert payment
            const paymentQuery = `
                INSERT INTO pagos (factura_id, monto, metodo)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const paymentResult = await client.query(paymentQuery, [facturaId, amount, method]);
            const payment = paymentResult.rows[0];

            // Update invoice balance and status
            const invoiceQuery = 'SELECT saldo, total FROM facturas WHERE id = $1 FOR UPDATE';
            const invoiceResult = await client.query(invoiceQuery, [facturaId]);

            if (invoiceResult.rows.length === 0) throw new Error('Factura no encontrada');

            const newBalance = parseFloat(invoiceResult.rows[0].saldo) - amount;
            const status = newBalance <= 0 ? 'PAID' : 'PARTIAL';

            const updateQuery = `
                UPDATE facturas
                SET saldo = $1, estado = $2, updated_at = NOW()
                WHERE id = $3
            `;
            await client.query(updateQuery, [newBalance, status, facturaId]);

            await client.query('COMMIT');
            return {
                id: payment.id,
                facturaId: payment.factura_id,
                date: payment.fecha,
                amount: parseFloat(payment.monto),
                method: payment.metodo
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    private static mapRowToInvoice(row: any): Invoice {
        return {
            id: row.id,
            numeroFactura: row.numero_factura,
            patientId: row.paciente_id,
            patientName: row.paciente_nombre,
            date: row.fecha,
            items: row.items,
            subtotal: parseFloat(row.subtotal),
            discount: parseFloat(row.descuento),
            total: parseFloat(row.total),
            balance: parseFloat(row.saldo),
            payerType: row.tipo_pagador,
            status: row.estado,
            payments: row.payments ? row.payments.map((p: any) => ({
                id: p.id,
                facturaId: p.factura_id,
                date: p.fecha,
                amount: parseFloat(p.monto),
                method: p.metodo
            })) : []
        };
    }
}
