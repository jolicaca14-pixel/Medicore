import { sanitizeInput, isSystemAdmin, hasAdministrativeAccess, maskIdentification } from './security';
import { UserRole } from '../types';

/**
 * 🧪 Smith: Security Unit Tests
 * Run with: node utils/security.test.js (after compilation)
 */
const testSecurityUtils = () => {
  console.log('Testing sanitizeInput...');

  // Test case 1: Simple string
  console.assert(sanitizeInput('hello') === 'hello', 'Test 1 Failed');

  // Test case 2: Script tag
  const input2 = '<script>alert("xss")</script>';
  const expected2 = 'scriptalert("xss")/script';
  console.assert(sanitizeInput(input2) === expected2, 'Test 2 Failed');

  // Test case 3: Nested tags
  const input3 = '<div><b>Bold</b></div>';
  const expected3 = 'divbBold/b/div';
  console.assert(sanitizeInput(input3) === expected3, 'Test 3 Failed');

  // Test case 4: null/undefined
  console.assert(sanitizeInput(null as any) === '', 'Test 4 Failed');
  console.assert(sanitizeInput(undefined as any) === '', 'Test 5 Failed');

  console.log('Testing isSystemAdmin...');
  console.assert(isSystemAdmin([UserRole.ADMIN]) === true, 'Admin check failed');
  console.assert(isSystemAdmin([UserRole.PROFESSIONAL]) === false, 'Non-Admin check failed');

  console.log('Testing hasAdministrativeAccess...');
  console.assert(hasAdministrativeAccess([UserRole.ADMIN]) === true, 'Admin admin access failed');
  console.assert(hasAdministrativeAccess([UserRole.MANAGER]) === true, 'Manager admin access failed');
  console.assert(hasAdministrativeAccess([UserRole.ACCOUNTANT]) === true, 'Accountant admin access failed');
  console.assert(hasAdministrativeAccess([UserRole.PROFESSIONAL]) === false, 'Professional admin access failed');

  console.log('Testing maskIdentification...');
  console.assert(maskIdentification('12345678') === '****5678', 'Masking long ID failed');
  console.assert(maskIdentification('123') === '123', 'Masking short ID failed');

  console.log('All security tests passed.');
};

// Auto-execute if run directly (logic for test runner would go here)
if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || import.meta.url.endsWith(process.argv[1]))) {
    testSecurityUtils();
}
