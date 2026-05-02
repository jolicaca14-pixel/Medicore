import { UserRole } from '../types';

/**
 * 🛡️ Sentinel: Input Sanitization Utility
 */
export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) return '';
  return input.replace(/<|>/g, '');
};

/**
 * Validates if the user is a system administrator.
 */
export const isSystemAdmin = (roles: UserRole[] = []): boolean => {
  return roles.includes(UserRole.ADMIN);
};

/**
 * Validates if the user has administrative access (Admin, Manager, Accountant).
 */
export const hasAdministrativeAccess = (roles: UserRole[] = []): boolean => {
  return roles.some(role => [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT].includes(role));
};

/**
 * Masks sensitive identification numbers.
 */
export const maskIdentification = (id: string): string => {
  if (id.length <= 4) return '****';
  return id.substring(0, id.length - 4).replace(/./g, '*') + id.substring(id.length - 4);
};
