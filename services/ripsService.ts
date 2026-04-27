const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ripsService = {
  async downloadUS(startDate: string, endDate: string) {
    const response = await fetch(`${API_URL}/rips/us?startDate=${startDate}&endDate=${endDate}`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}` }
    });
    if (!response.ok) throw new Error('Error al descargar US');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `US_${startDate}_${endDate}.txt`;
    a.click();
  },

  async downloadAC(startDate: string, endDate: string) {
    const response = await fetch(`${API_URL}/rips/ac?startDate=${startDate}&endDate=${endDate}`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}` }
    });
    if (!response.ok) throw new Error('Error al descargar AC');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AC_${startDate}_${endDate}.txt`;
    a.click();
  }
};

export const billingService = {
  async getAllInvoices() {
    const response = await fetch(`${API_URL}/facturacion`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}` }
    });
    if (!response.ok) throw new Error('Error al obtener facturas');
    return await response.json();
  }
};
