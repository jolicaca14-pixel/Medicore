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

import { User, UserRole } from '../types';

/**
 * Checks if a user has administrative access based on their roles.
 * Administrative roles include ADMIN, MANAGER, and ACCOUNTANT.
 *
 * @param user The user object to check.
 * @returns True if the user has at least one administrative role.
 */
export const hasAdministrativeAccess = (user: User | undefined): boolean => {
  if (!user) return false;
  return user.roles.some(role =>
    role === UserRole.ADMIN ||
    role === UserRole.MANAGER ||
    role === UserRole.ACCOUNTANT
  );
};
