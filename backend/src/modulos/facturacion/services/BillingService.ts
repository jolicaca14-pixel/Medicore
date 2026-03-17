import { Invoice } from '../types';

class BillingService {
    private invoices: Invoice[] = [
        {
            id: 'INV-001',
            patientId: 'p1',
            patientName: 'Juan Pérez',
            date: '2026-03-10T10:00:00Z',
            items: [{ code: '890201', name: 'CONSULTA DE PRIMERA VEZ POR MEDICINA GENERAL', price: 150000, quantity: 1 }],
            subtotal: 150000,
            discount: 0,
            total: 150000,
            balance: 0,
            payments: [{ id: 'pay-1', date: '2026-03-10T10:05:00Z', amount: 150000, method: 'CASH' }],
            payerType: 'INSURER',
            status: 'PAID'
        },
        {
            id: 'INV-002',
            patientId: 'p2',
            patientName: 'Maria Garcia',
            date: '2026-03-15T14:30:00Z',
            items: [{ code: '903841', name: 'Examen de Laboratorio', price: 85000, quantity: 1 }],
            subtotal: 85000,
            discount: 0,
            total: 85000,
            balance: 85000,
            payments: [],
            payerType: 'PATIENT',
            status: 'PENDING'
        }
    ];

    async getAllInvoices(): Promise<Invoice[]> {
        return this.invoices;
    }

    async getInvoiceById(id: string): Promise<Invoice | undefined> {
        return this.invoices.find(inv => inv.id === id);
    }

    async createInvoice(invoice: Invoice): Promise<Invoice> {
        this.invoices.push(invoice);
        return invoice;
    }

    async updateStatus(id: string, status: Invoice['status']): Promise<Invoice | undefined> {
        const index = this.invoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
            this.invoices[index].status = status;
            return this.invoices[index];
        }
        return undefined;
    }

    async addPayment(id: string, amount: number): Promise<Invoice | undefined> {
        const index = this.invoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
            const inv = this.invoices[index];
            inv.balance -= amount;
            inv.payments.push({
                id: `pay-${Date.now()}`,
                date: new Date().toISOString(),
                amount,
                method: 'CASH'
            });
            inv.status = inv.balance <= 0 ? 'PAID' : 'PARTIAL';
            return inv;
        }
        return undefined;
    }
}

export default new BillingService();
