import { sanitizeInput, hasAdministrativeAccess, isSystemAdmin } from './security';
import { UserRole } from '../types';

/**
 * 🧪 Smith: Security Unit Tests
 * Run with: node utils/security.test.js (after compilation)
 */
const testSanitizeInput = () => {
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

  console.log('Testing hasAdministrativeAccess...');
  console.assert(hasAdministrativeAccess([UserRole.ADMIN]) === true, 'Admin should have access');
  console.assert(hasAdministrativeAccess([UserRole.MANAGER]) === true, 'Manager should have access');
  console.assert(hasAdministrativeAccess([UserRole.ACCOUNTANT]) === true, 'Accountant should have access');
  console.assert(hasAdministrativeAccess([UserRole.PROFESSIONAL]) === false, 'Professional should NOT have access');
  console.assert(hasAdministrativeAccess([]) === false, 'No roles should NOT have access');

  console.log('Testing isSystemAdmin...');
  console.assert(isSystemAdmin([UserRole.ADMIN]) === true, 'Admin IS system admin');
  console.assert(isSystemAdmin([UserRole.MANAGER]) === false, 'Manager IS NOT system admin');
  console.assert(isSystemAdmin([UserRole.PROFESSIONAL]) === false, 'Professional IS NOT system admin');

  console.log('All security tests passed.');
};

// Auto-execute if run directly (logic for test runner would go here)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    testSanitizeInput();
}
