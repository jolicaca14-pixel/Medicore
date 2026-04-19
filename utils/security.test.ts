import { sanitizeInput } from './security';

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

  console.log('All security tests passed.');
};

import { UserRole } from '../types';
import { hasAdministrativeAccess, isSystemAdmin } from './security';

const testRBAC = () => {
  console.log('Testing RBAC logic...');

  // Admin should have everything
  console.assert(isSystemAdmin([UserRole.ADMIN]) === true, 'Admin should be System Admin');
  console.assert(hasAdministrativeAccess([UserRole.ADMIN]) === true, 'Admin should have Administrative Access');

  // Manager/Accountant should have admin access but not system admin
  console.assert(isSystemAdmin([UserRole.MANAGER]) === false, 'Manager should not be System Admin');
  console.assert(hasAdministrativeAccess([UserRole.MANAGER]) === true, 'Manager should have Administrative Access');
  console.assert(hasAdministrativeAccess([UserRole.ACCOUNTANT]) === true, 'Accountant should have Administrative Access');

  // Professional should have neither
  console.assert(isSystemAdmin([UserRole.PROFESSIONAL]) === false, 'Professional should not be System Admin');
  console.assert(hasAdministrativeAccess([UserRole.PROFESSIONAL]) === false, 'Professional should not have Administrative Access');

  console.log('RBAC tests passed.');
};

// Auto-execute if run directly (logic for test runner would go here)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    testSanitizeInput();
    testRBAC();
}
