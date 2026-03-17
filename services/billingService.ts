import { getAuthToken } from './authService';
import { MOCK_INVOICES } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/facturacion';

export const billingService = {
  async getInvoices() {
    try {
      const token = getAuthToken();
      const response = await fetch(API_URL, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Error al obtener facturas');
      return await response.json();
    } catch (error) {
      console.warn('Billing API fallback');
      return MOCK_INVOICES;
    }
  },

  async updateInvoiceStatus(id: string, status: string) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status })
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async registerPayment(id: string, amount: number) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/${id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ amount })
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};
