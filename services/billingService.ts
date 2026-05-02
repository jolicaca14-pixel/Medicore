import { Invoice } from '../backend/src/modulos/facturacion/types';

const API_URL = '/api/facturacion';

export const billingService = {
    async getAllInvoices(): Promise<Invoice[]> {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        });
        if (!response.ok) throw new Error('Error al obtener facturas');
        return response.json();
    },

    async generateInvoice(recordId: string): Promise<Invoice> {
        const response = await fetch(`${API_URL}/generar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ recordId })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al generar factura');
        }
        return response.json();
    },

    async downloadRIPS(type: 'US' | 'AC', invoiceIds: string[]): Promise<void> {
        const response = await fetch(`${API_URL}/rips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ type, invoiceIds })
        });
        if (!response.ok) throw new Error('Error al generar RIPS');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
};
