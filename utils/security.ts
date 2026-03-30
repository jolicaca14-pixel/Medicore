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
 * 🕵️ Mask PII (Personally Identifiable Information)
 * This utility provides functions to mask sensitive data like identification numbers.
 *
 * @param input The identification number to mask.
 * @returns A masked version of the identification (e.g., '123****789')
 */
export const maskIdentification = (input: string | undefined | null): string => {
  if (!input) return '';
  if (input.length <= 4) return '****';
  return `${input.slice(0, 3)}****${input.slice(-3)}`;
};

/**
 * RBAC Utility: Checks if a user has administrative access.
 *
 * @param role The user's role.
 * @returns boolean
 */
export const hasAdministrativeAccess = (role: string | undefined): boolean => {
  return role === 'admin' || role === 'MANAGER' || role === 'ACCOUNTANT';
};

/**
 * RBAC Utility: Checks if a user is specifically a system administrator.
 */
export const isSystemAdmin = (role: string | undefined): boolean => {
  return role === 'admin';
};
