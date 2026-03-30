export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    ISSUED = 'ISSUED',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
}

export interface InvoiceItem {
    id?: string;
    factura_id?: string;
    descripcion: string;
    codigo_servicio?: string;
    cantidad: number;
    valor_unitario: number;
    valor_total: number;
}

export interface Invoice {
    id: string;
    paciente_id: string;
    hce_id?: string;
    numero_factura: string;
    fecha_emision: string;
    subtotal: number;
    impuestos: number;
    total: number;
    estado: InvoiceStatus;
    metodo_pago?: string;
    notas?: string;
    items?: InvoiceItem[];
}
