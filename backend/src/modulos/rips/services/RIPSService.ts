import { BillingService } from '../../facturacion/services/BillingService';

export class RIPSService {
    static async generateRIPS(startDate: string, endDate: string) {
        const invoices = await BillingService.getInvoices();
        const filtered = invoices.filter(i => {
            const d = i.date.split('T')[0];
            return d >= startDate && d <= endDate;
        });

        // Simple mock generation of US and AC files
        const US = filtered.map(i => ({
            tipo_documento: 'CC',
            numero_documento: '123456', // Should be from patient
            apellido1: i.patientName.split(' ')[1] || '',
            nombre1: i.patientName.split(' ')[0] || ''
        }));

        const AC = filtered.flatMap(i => i.items.map(item => ({
            numero_factura: i.id,
            fecha_consulta: i.date.split('T')[0],
            codigo_consulta: item.code,
            valor_consulta: item.price
        })));

        return { US, AC, AP: [], AF: [] };
    }
}
