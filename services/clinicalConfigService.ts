import { RoleTemplate, TemplateSection, TemplateField } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const clinicalConfigService = {
    async getTemplates(): Promise<RoleTemplate[]> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/configuracion-clinica/templates`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch templates');
        return response.json();
    },

    async getSections(): Promise<TemplateSection[]> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/configuracion-clinica/sections`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch sections');
        return response.json();
    },

    async getFields(): Promise<TemplateField[]> {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/configuracion-clinica/fields`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch fields');
        return response.json();
    }
};
