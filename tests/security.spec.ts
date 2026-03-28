import { sanitizeInput, hasAdministrativeAccess, isSystemAdmin } from '../utils/security';
import { UserRole } from '../types';
import { test, expect } from '@playwright/test';

/**
 * 🧪 Security Unit Tests
 */

test('sanitizeInput - should remove < and > characters', () => {
  expect(sanitizeInput('hello')).toBe('hello');
  expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
  expect(sanitizeInput('<div><b>Bold</b></div>')).toBe('divbBold/b/div');
  expect(sanitizeInput(null)).toBe('');
  expect(sanitizeInput(undefined)).toBe('');
});

test('hasAdministrativeAccess - should grant access to ADMIN, MANAGER, ACCOUNTANT', () => {
    expect(hasAdministrativeAccess([UserRole.ADMIN])).toBe(true);
    expect(hasAdministrativeAccess([UserRole.MANAGER])).toBe(true);
    expect(hasAdministrativeAccess([UserRole.ACCOUNTANT])).toBe(true);
    expect(hasAdministrativeAccess([UserRole.PROFESSIONAL])).toBe(false);
    expect(hasAdministrativeAccess([UserRole.SECRETARY])).toBe(false);
    expect(hasAdministrativeAccess([UserRole.ADMIN, UserRole.PROFESSIONAL])).toBe(true);
});

test('isSystemAdmin - should strictly check for ADMIN role', () => {
    expect(isSystemAdmin([UserRole.ADMIN])).toBe(true);
    expect(isSystemAdmin([UserRole.MANAGER])).toBe(false);
    expect(isSystemAdmin([UserRole.ACCOUNTANT])).toBe(false);
    expect(isSystemAdmin([UserRole.ADMIN, UserRole.MANAGER])).toBe(true);
});
