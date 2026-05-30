const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const reportService = {
    async getMetrics() {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/reportes/metrics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch metrics');
        return response.json();
    },

    async generateRIPS(startDate: string, endDate: string) {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/rips?startDate=${startDate}&endDate=${endDate}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to generate RIPS');
        return response.json();
    }
};
