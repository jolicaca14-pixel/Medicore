import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/auth';

// Helper to map backend user to frontend User type
const mapUser = (backendData: any): User => {
  const { usuario, accessToken } = backendData;
  return {
    id: usuario.id,
    username: usuario.username,
    name: usuario.nombre_completo,
    documentNumber: usuario.documento,
    email: usuario.email,
    roles: [usuario.rol.toUpperCase() as UserRole],
    // Store accessToken in the user object for convenience in demo
    // In a real app we might use a separate storage
    ...({ accessToken } as any)
  };
};

export const getAuthToken = () => {
  const session = sessionStorage.getItem('medicore_session');
  if (!session) return null;
  try {
    const data = JSON.parse(session);
    return data.accessToken || null;
  } catch (e) {
    return null;
  }
};

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

      const data = await response.json();
      return mapUser(data);
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
    const session = sessionStorage.getItem('medicore_session');
    const token = session ? JSON.parse(session).accessToken : null;

    try {
      const response = await fetch(`${API_URL}/me`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) return null;
      const data = await response.json();
      // Map 'me' response which might just be the user object
      return mapUser({ usuario: data.usuario, accessToken: token });
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
