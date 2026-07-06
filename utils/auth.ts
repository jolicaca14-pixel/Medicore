import { User, UserRole } from '../types';

/**
 * Checks if a user has administrative privileges.
 * Administrative roles include ADMIN, MANAGER, and ACCOUNTANT.
 */
export const isAdministrative = (user: User | Partial<User> | null): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.some(role =>
    role === UserRole.ADMIN ||
    role === UserRole.MANAGER ||
    role === UserRole.ACCOUNTANT
  );
};
