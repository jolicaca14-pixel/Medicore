export interface Invoice {
    id: string;
    numeroFactura: string;
    patientId: string;
    patientName: string;
    date: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    balance: number;
    payerType: 'PATIENT' | 'INSURER';
    status: 'PAID' | 'PENDING' | 'PARTIAL' | 'CANCELLED';
    payments?: Payment[];
}

export interface InvoiceItem {
    code: string;
    name: string;
    price: number;
    quantity: number;
    discount?: number;
    isSupply?: boolean;
}

export interface Payment {
    id: string;
    facturaId: string;
    date: string;
    amount: number;
    method: 'CASH' | 'CARD' | 'TRANSFER';
}
