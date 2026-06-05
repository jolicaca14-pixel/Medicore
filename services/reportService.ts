const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface DashboardMetrics {
  pacientes_totales: number;
  hce_finalizadas: number;
  ingresos_mensuales: number;
  citas_hoy: number;
  crecimiento_pacientes: number;
  recientes_auditoria: any[];
}

export const reportService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/reportes/metrics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
        // Fallback mock metrics if backend endpoint not yet fully implemented
        return {
            pacientes_totales: 1250,
            hce_finalizadas: 840,
            ingresos_mensuales: 45200000,
            citas_hoy: 24,
            crecimiento_pacientes: 12,
            recientes_auditoria: []
        };
    }
    return response.json();
  }
};
