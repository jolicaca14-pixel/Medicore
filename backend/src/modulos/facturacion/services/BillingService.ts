import pool from '../../../config/database';
import { Invoice, Payment } from '../types';

export class BillingService {
    static async getInvoices(): Promise<Invoice[]> {
        const result = await pool.query('SELECT * FROM facturas ORDER BY fecha DESC');
        return result.rows.map(row => ({
            id: row.id,
            patientId: row.paciente_id,
            patientName: row.paciente_nombre,
            date: row.fecha,
            items: row.items,
            subtotal: Number(row.subtotal),
            discount: Number(row.descuento),
            total: Number(row.total),
            balance: Number(row.saldo),
            payments: row.pagos,
            payerType: row.tipo_pagador,
            status: row.estado
        }));
    }

    static async getInvoiceById(id: string): Promise<Invoice | null> {
        const result = await pool.query('SELECT * FROM facturas WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        const row = result.rows[0];
        return {
            id: row.id,
            patientId: row.paciente_id,
            patientName: row.paciente_nombre,
            date: row.fecha,
            items: row.items,
            subtotal: Number(row.subtotal),
            discount: Number(row.descuento),
            total: Number(row.total),
            balance: Number(row.saldo),
            payments: row.pagos,
            payerType: row.tipo_pagador,
            status: row.estado
        };
    }

    static async createInvoice(invoice: Invoice): Promise<Invoice> {
        const result = await pool.query(
            `INSERT INTO facturas (id, paciente_id, paciente_nombre, fecha, items, subtotal, descuento, total, saldo, pagos, tipo_pagador, estado)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             RETURNING *`,
            [invoice.id, invoice.patientId, invoice.patientName, invoice.date, JSON.stringify(invoice.items), invoice.subtotal, invoice.discount, invoice.total, invoice.balance, JSON.stringify(invoice.payments), invoice.payerType, invoice.status]
        );
        return result.rows[0];
    }

    static async registerPayment(invoiceId: string, payment: Payment): Promise<Invoice | null> {
        const invoice = await this.getInvoiceById(invoiceId);
        if (!invoice) return null;

        invoice.payments.push(payment);
        invoice.balance -= payment.amount;

        if (invoice.balance <= 0) {
            invoice.status = 'PAID';
            invoice.balance = 0;
        } else {
            invoice.status = 'PARTIAL';
        }

        const result = await pool.query(
            `UPDATE facturas SET pagos = $1, saldo = $2, estado = $3 WHERE id = $4 RETURNING *`,
            [JSON.stringify(invoice.payments), invoice.balance, invoice.status, invoiceId]
        );

        return result.rows[0];
    }
}
