import { useState, useCallback } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('medicore_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback((u: User) => {
    sessionStorage.setItem('medicore_session', JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('medicore_session');
    setUser(null);
  }, []);

  return {
    user,
    login,
    logout
  };
};
