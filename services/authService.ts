import { User } from '../types';
import { MOCK_USERS } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/auth';

export const authService = {
  async login(username: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la autenticación');
      }

      return response.json();
    } catch (error: any) {
      console.warn('Backend connection failed, falling back to mock data:', error.message);

      // Fallback logic for demo/offline mode
      const user = MOCK_USERS.find(u => u.username === username);
      if (user && password === user.documentNumber) {
        return user;
      }
      throw new Error(error.message === 'Failed to fetch' ? 'Servidor no disponible. Use credenciales de demo.' : error.message);
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
    } catch (e) {
      console.warn('Logout API failed');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/me`);
      if (!response.ok) {
        // Fallback for demo mode if backend is unreachable
        const sessionUser = sessionStorage.getItem('medicore_session');
        if (sessionUser) {
          console.warn('getCurrentUser failed, trusting sessionStorage');
          return JSON.parse(sessionUser);
        }
        return null;
      }
      return response.json();
    } catch (e) {
      // Fallback for demo mode if backend is unreachable
      const sessionUser = sessionStorage.getItem('medicore_session');
      if (sessionUser) {
        console.warn('getCurrentUser failed, trusting sessionStorage');
        return JSON.parse(sessionUser);
      }
      return null;
    }
  },

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/refresh`, { method: 'POST' });
      return response.ok;
    } catch (e) {
      // 🛡️ MORPHEUS: Fallback for demo mode
      return !!sessionStorage.getItem('medicore_session');
    }
  }
};
