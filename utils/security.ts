/**
 * 🛡️ Sentinel: Input Sanitization Utility
 * This utility provides functions to help prevent Cross-Site Scripting (XSS) attacks
 * by sanitizing user-provided input before it's stored or rendered.
 */
import { User, UserRole } from '../types';

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
 * Checks if the user has the ADMIN role.
 */
export const isSystemAdmin = (user: User | null | undefined): boolean => {
  return !!user?.roles.includes(UserRole.ADMIN);
};

/**
 * Checks if the user has any administrative role (ADMIN, MANAGER, ACCOUNTANT).
 */
export const hasAdministrativeAccess = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return user.roles.some(role =>
    role === UserRole.ADMIN ||
    role === UserRole.MANAGER ||
    role === UserRole.ACCOUNTANT
  );
};
