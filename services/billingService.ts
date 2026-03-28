import { fetchWrapper } from '../utils/fetchWrapper';

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

export const billingService = {
    async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
        return fetchWrapper.post('/api/facturacion', data);
    },

    async getInvoicesByPatient(patientId: string): Promise<Invoice[]> {
        return fetchWrapper.get(`/api/facturacion/paciente/${patientId}`);
    },

    async registerPayment(invoiceId: string, amount: number, method: string, userId: string): Promise<any> {
        return fetchWrapper.post(`/api/facturacion/${invoiceId}/pagar`, { amount, method, userId });
    }
};
