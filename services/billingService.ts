const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface InvoiceDetail {
    codigo_servicio: string;
    descripcion: string;
    cantidad: number;
    valor_unitario: number;
    valor_total: number;
}

export interface Invoice {
    id: string;
    paciente_id: string;
    cita_id?: string;
    historia_id?: string;
    fecha_emision: string;
    total: number;
    estado: 'PENDIENTE' | 'PAGADA' | 'ANULADA';
    detalles?: InvoiceDetail[];
}

export interface CreateInvoiceDTO {
    paciente_id: string;
    cita_id?: string;
    historia_id?: string;
    detalles: InvoiceDetail[];
}

export const billingService = {
    async getAllInvoices(): Promise<Invoice[]> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/facturacion`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al obtener facturas');
        return response.json();
    },

    async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/facturacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al crear factura');
        return response.json();
    }
};
