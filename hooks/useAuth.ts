import { useState, useCallback, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('medicore_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(username, password);
      sessionStorage.setItem('medicore_session', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      sessionStorage.removeItem('medicore_session');
      setUser(null);
    }
  }, []);

  // Check if session is still valid on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          // If token expired, try to refresh
          const success = await authService.refreshToken();
          if (!success) {
            logout();
          }
        }
      }
    };
    checkAuth();
  }, [user, logout]);

  return {
    user,
    isLoading,
    login,
    logout
  };
};
