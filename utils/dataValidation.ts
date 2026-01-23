import { MOCK_CIE11, MOCK_SOAT_TARIFF } from '../constants';

/**
 * 🔮 The Oracle: Data Validation Utility
 * Ensures that clinical data adheres to expected standards and mock datasets.
 */

/**
 * Validates if a given CIE-11 code exists in the master dataset.
 *
 * @param code The CIE-11 code to validate (e.g., '1B21').
 * @returns boolean indicating if the code is valid.
 */
export const validateCIE11Code = (code: string): boolean => {
  if (!code) return false;
  return MOCK_CIE11.some(item => item.code === code);
};

/**
 * Returns the full name of a CIE-11 code if it exists.
 *
 * @param code The CIE-11 code.
 * @returns The name of the diagnosis or null if not found.
 */
export const getCIE11Name = (code: string): string | null => {
  const item = MOCK_CIE11.find(item => item.code === code);
  return item ? item.name : null;
};

/**
 * Validates if a given CUPS/SOAT procedure code exists.
 *
 * @param code The CUPS/SOAT code.
 * @returns boolean
 */
export const validateCUPSCode = (code: string): boolean => {
  if (!code) return false;
  return MOCK_SOAT_TARIFF.some(item => item.code === code);
};
