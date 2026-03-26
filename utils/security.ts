import { User, UserRole } from '../types';

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
 * Validates if the user has administrative access (ADMIN, MANAGER, or ACCOUNTANT).
 */
export const hasAdministrativeAccess = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const adminRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT];
  return user.roles.some(role => adminRoles.includes(role));
};

/**
 * Strictly validates if the user is a System Administrator (ADMIN only).
 */
export const isSystemAdmin = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return user.roles.includes(UserRole.ADMIN);
};
