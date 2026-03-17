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
 * 🛡️ Sentinel: Identification Masking Utility
 * Masks sensitive identification numbers while keeping the first and last few characters visible.
 *
 * @param id The identification string to mask.
 * @returns The masked identification string.
 *
 * @example
 * maskIdentification('1234567890') // returns '123****890'
 */
export const maskIdentification = (id: string | undefined | null): string => {
  if (!id) return '';
  if (id.length <= 6) return id;
  return `${id.slice(0, 3)}****${id.slice(-3)}`;
};
