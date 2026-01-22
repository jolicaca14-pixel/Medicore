/**
 * 🛡️ Sentinel: Security Utilities
 * This file contains functions to mitigate security risks.
 */

/**
 * Basic input sanitizer to prevent prompt injection.
 * It removes common control characters and keywords used to manipulate LLMs.
 * This is a basic first-line defense and should be expanded upon.
 *
 * @param input The user-provided string to sanitize.
 * @returns A sanitized string.
 */
export const sanitizeInput = (input: string): string => {
  // Removes characters that could be used to terminate or start new instructions.
  // Strips backticks, pipes, and semicolons.
  let sanitized = input.replace(/[`|;]/g, '');

  // Removes common instruction-hijacking keywords (case-insensitive).
  // Keywords like "ignore", "forget", "instruction" are targeted.
  sanitized = sanitized.replace(/\b(ignore|forget|instruction|prompt|system)\b/gi, '');

  return sanitized;
};
