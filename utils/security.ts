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
 * Utility to mask sensitive identifiers for display (e.g. '12345678' -> '123****78')
 */
export const maskIdentification = (id: string): string => {
  if (id.length <= 4) return id;
  return id.substring(0, 3) + '****' + id.substring(id.length - 3);
};

/**
 * Check if the user has administrative privileges (ADMIN, MANAGER, or ACCOUNTANT)
 */
export const hasAdministrativeAccess = (roles: UserRole[]): boolean => {
  return roles.some(role =>
    role === UserRole.ADMIN ||
    role === UserRole.MANAGER ||
    role === UserRole.ACCOUNTANT
  );
};
