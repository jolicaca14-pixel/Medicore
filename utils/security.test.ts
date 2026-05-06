import { sanitizeInput, isSystemAdmin, hasAdministrativeAccess, maskIdentification } from './security';
import { UserRole, User } from '../types';

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

const testRBAC = () => {
    console.log('Testing RBAC and Utilities...');

    const adminUser: User = { id: '1', roles: [UserRole.ADMIN], documentNumber: '123', username: 'admin', name: 'Admin' };
    const managerUser: User = { id: '2', roles: [UserRole.MANAGER], documentNumber: '456', username: 'manager', name: 'Manager' };
    const doctorUser: User = { id: '3', roles: [UserRole.PROFESSIONAL], documentNumber: '789', username: 'doc', name: 'Doc' };

    console.assert(isSystemAdmin(adminUser) === true, 'Admin check failed');
    console.assert(isSystemAdmin(managerUser) === false, 'Manager should not be system admin');

    console.assert(hasAdministrativeAccess(adminUser) === true, 'Admin access failed');
    console.assert(hasAdministrativeAccess(managerUser) === true, 'Manager access failed');
    console.assert(hasAdministrativeAccess(doctorUser) === false, 'Doctor should not have administrative access');

    console.assert(maskIdentification('123456789') === '12***89', 'Masking failed');
    console.assert(maskIdentification('123') === '123', 'Short ID masking failed');

    console.log('RBAC and Utilities tests passed.');
};

testSanitizeInput();
testRBAC();
