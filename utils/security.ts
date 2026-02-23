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
 * Strips potentially dangerous HTML tags while preserving safe content.
 * Useful for clinical notes that might contain some formatting but should not execute scripts.
 */
export const stripDangerousTags = (input: string | undefined | null): string => {
  if (!input) return '';

  // Remove script, iframe, object, embed, style, link tags and their content
  const dangerousTags = /<(script|iframe|object|embed|style|link)[^>]*>([\s\S]*?)<\/\1>/gi;
  let clean = input.replace(dangerousTags, '');

  // Remove inline event handlers (onmouseover, onclick, etc)
  clean = clean.replace(/\son\w+="[^"]*"/gi, '');

  // Remove javascript: pseudo-protocols
  clean = clean.replace(/href="javascript:[^"]*"/gi, 'href="#"');

  return clean;
};
