import pool from '../../../config/database';
import { CreateInvoiceDTO, Invoice } from '../types';

export class FacturacionService {
    // 💰 LEDGER: Base value for SOAT 2024 (Approximate SMDLV)
    private readonly SMDLV = 43333; // Salario Mínimo Diario Legal Vigente 2024

    async getAllInvoices(): Promise<Invoice[]> {
        const result = await pool.query('SELECT * FROM facturas ORDER BY fecha_emision DESC');
        return result.rows;
    }

    async getInvoiceById(id: string): Promise<Invoice> {
        const invoiceRes = await pool.query('SELECT * FROM facturas WHERE id = $1', [id]);
        const detailsRes = await pool.query('SELECT * FROM detalles_factura WHERE factura_id = $1', [id]);

        const invoice = invoiceRes.rows[0];
        if (invoice) {
            invoice.detalles = detailsRes.rows;
        }
        return invoice;
    }

    async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const total = data.detalles.reduce((acc, item) => acc + Number(item.valor_total), 0);

            const invoiceRes = await client.query(
                `INSERT INTO facturas (paciente_id, cita_id, historia_id, total)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [data.paciente_id, data.cita_id, data.historia_id, total]
            );

            const invoiceId = invoiceRes.rows[0].id;

            for (const item of data.detalles) {
                await client.query(
                    `INSERT INTO detalles_factura (factura_id, codigo_servicio, descripcion, cantidad, valor_unitario, valor_total)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [invoiceId, item.codigo_servicio, item.descripcion, item.cantidad, item.valor_unitario, item.valor_total]
                );
            }

            await client.query('COMMIT');
            return invoiceRes.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // 💰 LEDGER: Calculate SOAT rate based on factor
    calculateSOATRate(factor: number): number {
        return Math.round(this.SMDLV * factor);
    }

    async updateStatus(id: string, estado: 'PENDIENTE' | 'PAGADA' | 'ANULADA'): Promise<void> {
        await pool.query('UPDATE facturas SET estado = $1, updated_at = NOW() WHERE id = $2', [estado, id]);
    }
}

export default new FacturacionService();
