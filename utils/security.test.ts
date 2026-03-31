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

import { UserRole, User } from '../types';
import { isSystemAdmin, hasAdministrativeAccess } from './security';

const testRBAC = () => {
    console.log('Testing RBAC utilities...');

    const adminUser: User = { id: '1', roles: [UserRole.ADMIN], name: 'Admin', username: 'admin', documentNumber: '123' };
    const professionalUser: User = { id: '2', roles: [UserRole.PROFESSIONAL], name: 'Doc', username: 'doc', documentNumber: '456' };
    const managerUser: User = { id: '3', roles: [UserRole.MANAGER], name: 'Manager', username: 'manager', documentNumber: '789' };

    console.assert(isSystemAdmin(adminUser) === true, 'isSystemAdmin: Admin should be true');
    console.assert(isSystemAdmin(professionalUser) === false, 'isSystemAdmin: Professional should be false');
    console.assert(isSystemAdmin(null) === false, 'isSystemAdmin: null should be false');

    console.assert(hasAdministrativeAccess(adminUser) === true, 'hasAdministrativeAccess: Admin should be true');
    console.assert(hasAdministrativeAccess(managerUser) === true, 'hasAdministrativeAccess: Manager should be true');
    console.assert(hasAdministrativeAccess(professionalUser) === false, 'hasAdministrativeAccess: Professional should be false');
    console.assert(hasAdministrativeAccess(null) === false, 'hasAdministrativeAccess: null should be false');

    console.log('RBAC utilities tests passed.');
};

// Auto-execute if run directly (logic for test runner would go here)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    testSanitizeInput();
    testRBAC();
}
