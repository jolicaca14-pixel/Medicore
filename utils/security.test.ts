import { sanitizeInput, isSystemAdmin, hasAdministrativeAccess } from './security';
import { User, UserRole } from '../types';

/**
 * 🧪 Smith: Security Unit Tests
 * Run with: node utils/security.test.js (after compilation)
 */
const testRBAC = () => {
  console.log('Testing RBAC functions...');
  const adminUser: User = { id: '1', roles: [UserRole.ADMIN], name: 'Admin', username: 'admin', documentNumber: '1' };
  const managerUser: User = { id: '2', roles: [UserRole.MANAGER], name: 'Manager', username: 'manager', documentNumber: '2' };
  const professionalUser: User = { id: '3', roles: [UserRole.PROFESSIONAL], name: 'Doc', username: 'doc', documentNumber: '3' };

  console.assert(isSystemAdmin(adminUser) === true, 'Admin should be System Admin');
  console.assert(isSystemAdmin(managerUser) === false, 'Manager should NOT be System Admin');

  console.assert(hasAdministrativeAccess(adminUser) === true, 'Admin should have administrative access');
  console.assert(hasAdministrativeAccess(managerUser) === true, 'Manager should have administrative access');
  console.assert(hasAdministrativeAccess(professionalUser) === false, 'Professional should NOT have administrative access');

  console.log('RBAC tests passed.');
};

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

// Auto-execute if run directly (logic for test runner would go here)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    testRBAC();
    testSanitizeInput();
}
