import { getAuthToken } from './authService';
import { MOCK_CONTRACTS } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/rrhh';

export const hrService = {
  async getMyContract() {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/my-contract`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.warn('HR API fallback');
      return MOCK_CONTRACTS[0];
    }
  },

  async getMyDisciplinaryHistory() {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/my-disciplinary`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async respondDisciplinary(id: string, response: string) {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/disciplinary/${id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ response })
      });
      return res.ok;
    } catch (error) {
      return false;
    }
  }
};
