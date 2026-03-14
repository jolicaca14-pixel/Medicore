import { sanitizeInput, hasAdministrativeAccess } from './security';
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

  console.log('All security tests passed.');
};

const testHasAdministrativeAccess = () => {
    console.log('Testing hasAdministrativeAccess...');

    const adminUser = { roles: [UserRole.ADMIN] };
    const managerUser = { roles: [UserRole.MANAGER] };
    const accountantUser = { roles: [UserRole.ACCOUNTANT] };
    const normalUser = { roles: [UserRole.PROFESSIONAL] };
    const mixedUser = { roles: [UserRole.PROFESSIONAL, UserRole.MANAGER] };

    console.assert(hasAdministrativeAccess(adminUser) === true, 'Admin access failed');
    console.assert(hasAdministrativeAccess(managerUser) === true, 'Manager access failed');
    console.assert(hasAdministrativeAccess(accountantUser) === true, 'Accountant access failed');
    console.assert(hasAdministrativeAccess(normalUser) === false, 'Normal user should not have admin access');
    console.assert(hasAdministrativeAccess(mixedUser) === true, 'Mixed user access failed');
    console.assert(hasAdministrativeAccess(null) === false, 'Null user failed');

    console.log('Administrative access tests passed.');
};

// Auto-execute if run directly (logic for test runner would go here)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    testSanitizeInput();
    testHasAdministrativeAccess();
}
