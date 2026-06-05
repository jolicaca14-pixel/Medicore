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
    fecha_emision: Date;
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
