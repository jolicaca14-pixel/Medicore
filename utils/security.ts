import { User, UserRole } from '../types';

/**
 * 🛡️ Sentinel: Input Sanitization Utility
 */

export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) {
    return '';
  }
  return input.replace(/<|>/g, '');
};

/**
 * RBAC Utilities
 */

export const isSystemAdmin = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return user.roles.includes(UserRole.ADMIN);
};

export const hasAdministrativeAccess = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const adminRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT];
  return user.roles.some(role => adminRoles.includes(role));
};

/**
 * PII Protection
 */

export const maskIdentification = (id: string | undefined | null): string => {
  if (!id) return '';
  if (id.length <= 4) return '****';
  return id.substring(0, id.length - 4).replace(/./g, '*') + id.substring(id.length - 4);
};
