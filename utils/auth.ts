import { User, UserRole } from '../types';

export const isAdministrative = (user: User | undefined | null): boolean => {
  if (!user) return false;
  const adminRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT];
  return user.roles.some(role => adminRoles.includes(role));
};
