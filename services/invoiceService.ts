import { Invoice, Payment } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    try {
      const response = await fetch(`${API_URL}/facturacion`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener facturas');
      return await response.json();
    } catch (error) {
      console.error('invoiceService.getAll error:', error);
      throw error;
    }
  },

  async create(invoice: Partial<Invoice>): Promise<Invoice> {
    try {
      const response = await fetch(`${API_URL}/facturacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(invoice)
      });
      if (!response.ok) throw new Error('Error al crear factura');
      return await response.json();
    } catch (error) {
      console.error('invoiceService.create error:', error);
      throw error;
    }
  },

  async addPayment(facturaId: string, amount: number, method: string): Promise<Payment> {
    try {
      const response = await fetch(`${API_URL}/facturacion/${facturaId}/pagos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ amount, method })
      });
      if (!response.ok) throw new Error('Error al registrar pago');
      return await response.json();
    } catch (error) {
      console.error('invoiceService.addPayment error:', error);
      throw error;
    }
  }
};
