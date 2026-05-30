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
    date: string;
    amount: number;
    method: 'CASH' | 'CARD' | 'TRANSFER';
}

export interface Invoice {
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    balance: number;
    payments: Payment[];
    payerType: 'PATIENT' | 'INSURER';
    status: 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED';
}
