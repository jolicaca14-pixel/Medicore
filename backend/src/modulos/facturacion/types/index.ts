export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
}

export interface Invoice {
    id: string;
    patientId: string;
    clinicalRecordId: string;
    date: string;
    totalAmount: number;
    status: InvoiceStatus;
    items: InvoiceItem[];
}

export interface InvoiceItem {
    description: string;
    code: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
