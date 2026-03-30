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
 * 🛡️ Sentinel: Role-Based Access Control (RBAC) Utilities
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
 * 🛡️ Sentinel: PII Masking Utility
 * Masks sensitive information like identification numbers for privacy.
 */
export const maskIdentification = (id: string): string => {
  if (id.length <= 4) return "****";
  return id.slice(0, -4).replace(/./g, '*') + id.slice(-4);
};
