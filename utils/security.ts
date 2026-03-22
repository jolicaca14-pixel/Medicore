import { User, UserRole } from '../types';

/**
 * 🛡️ Sentinel: Input Sanitization Utility
 * This utility provides functions to help prevent Cross-Site Scripting (XSS) attacks
 * by sanitizing user-provided input before it's stored or rendered.
 */

/**
 * A simple regex-based sanitizer to strip HTML tags from a string.
 *
 * @param input The string to sanitize.
 * @returns A new string with HTML tags removed.
 */
export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) {
    return '';
  }
  return input.replace(/<|>/g, '');
};

/**
 * 🛡️ Sentinel: Administrative Access Control
 * Checks if a user has administrative privileges (ADMIN, MANAGER, or ACCOUNTANT).
 */
export const hasAdministrativeAccess = (user: User | undefined | null): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(role =>
        role === UserRole.ADMIN ||
        role === UserRole.MANAGER ||
        role === UserRole.ACCOUNTANT
    );
};

/**
 * 🛡️ Sentinel: PII Masking
 * Partially masks an identification number for privacy.
 * Example: "123456789" -> "123****89"
 */
export const maskIdentification = (id: string | undefined | null): string => {
    if (!id) return '';
    if (id.length <= 4) return id;
    const first = id.substring(0, 3);
    const last = id.substring(id.length - 2);
    return `${first}****${last}`;
};
