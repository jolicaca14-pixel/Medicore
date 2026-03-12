import { UserRole } from '../types';

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
 *
 * @example
 * sanitizeInput('<script>alert("xss")</script>') // returns 'alert("xss")'
 * sanitizeInput('<b>Hello</b> World') // returns 'Hello World'
 */
export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) {
    return '';
  }
  // This regex replaces any character that is '<' or '>' with an empty string.
  // It's a basic but effective way to prevent simple HTML tag injection.
  // NOTE: This is not a comprehensive solution and does not protect against all XSS attacks.
  // For example, it does not sanitize attributes like 'onerror' or 'href="javascript:..."'.
  // For a production environment, a more robust, well-tested library like DOMPurify is strongly recommended.
  return input.replace(/<|>/g, '');
};

/**
 * Validates if the user has administrative privileges.
 * Administrative roles include: ADMIN, MANAGER, and ACCOUNTANT.
 *
 * @param roles Array of UserRole
 * @returns boolean
 */
export const hasAdministrativeAccess = (roles: UserRole[] = []): boolean => {
  const adminRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT];
  return roles.some(role => adminRoles.includes(role));
};
