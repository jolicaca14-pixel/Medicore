import { Invoice, Payment } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const billingService = {
    async getInvoices(): Promise<Invoice[]> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/facturacion`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch invoices');
        return response.json();
    },

    async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/facturacion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoice)
        });
        if (!response.ok) throw new Error('Failed to create invoice');
        return response.json();
    },

    async registerPayment(invoiceId: string, payment: Partial<Payment>): Promise<Invoice> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/facturacion/${invoiceId}/pagos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment)
        });
        if (!response.ok) throw new Error('Failed to register payment');
        return response.json();
    }
};
