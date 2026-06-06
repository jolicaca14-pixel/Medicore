const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const prescriptionService = {
    async getByPatientId(patientId: string): Promise<any[]> {
        const response = await fetch(`${API_URL}/recetas/paciente/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar recetas');
        return response.json();
    },

    async create(data: any): Promise<any> {
        const response = await fetch(`${API_URL}/recetas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al crear receta');
        return response.json();
    }
};
