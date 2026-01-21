/**
 * 🛡️ Sentinel: Input Sanitization
 *
 * This function provides a basic defense against prompt injection by stripping
 * out characters and keywords commonly used to manipulate Large Language Models (LLMs).
 *
 * It is NOT a complete security solution but serves as a critical first line of defense.
 * For production systems, consider more advanced techniques like allow-listing,
 * instruction detection models, or dedicated prompt security libraries.
 *
 * @param input The raw user input string.
 * @returns A sanitized string with potential injection vectors removed.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  // 1. Remove characters that can be used for injection or markdown manipulation.
  // We are being aggressive here to prioritize security.
  let sanitized = input.replace(/[<>`"'{}]/g, '');

  // 2. Remove common instruction-hijacking keywords (case-insensitive).
  const injectionKeywords = [
    'ignore previous instructions',
    'disregard the above',
    'new instructions:',
    'prompt injection',
    'system prompt',
    'malicious input',
  ];

  const keywordRegex = new RegExp(injectionKeywords.join('|'), 'gi');
  sanitized = sanitized.replace(keywordRegex, '[REDACTED]');

  return sanitized;
};
