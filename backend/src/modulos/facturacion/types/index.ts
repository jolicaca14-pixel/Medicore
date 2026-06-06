export interface Invoice {
    id: string;
    patientId: string;
    date: string;
    total: number;
    status: 'DRAFT' | 'PAID' | 'CANCELLED';
    clinicalRecordId?: string;
    items: InvoiceItem[];
}

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    code?: string; // CUPS
}

export interface CreateInvoiceDTO {
    patientId: string;
    clinicalRecordId?: string;
    items: InvoiceItem[];
}
