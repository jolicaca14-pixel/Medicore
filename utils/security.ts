import { UserRole } from '../types';

/**
 * 🛡️ Sentinel: Input Sanitization Utility
 * This utility provides functions to help prevent Cross-Site Scripting (XSS) attacks
 * by sanitizing user-provided input before it's stored or rendered.
 */

/**
 * A simple regex-based sanitizer to strip HTML tags from a string.
 */
export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) {
    return '';
  }
  return input.replace(/<|>/g, '');
};

/**
 * 🛡️ RBAC: Checks if the user has the ADMIN role.
 */
export const isSystemAdmin = (roles: UserRole[]): boolean => {
  return roles.includes(UserRole.ADMIN);
};

/**
 * 🛡️ RBAC: Checks if the user has administrative access (ADMIN, MANAGER, or ACCOUNTANT).
 */
export const hasAdministrativeAccess = (roles: UserRole[]): boolean => {
  return roles.some(role =>
    role === UserRole.ADMIN ||
    role === UserRole.MANAGER ||
    role === UserRole.ACCOUNTANT
  );
};

/**
 * 🛡️ PII: Masks identification numbers for privacy.
 */
export const maskIdentification = (id: string): string => {
  if (!id || id.length <= 4) return id;
  return id.substring(0, id.length - 4).replace(/./g, '*') + id.substring(id.length - 4);
};
