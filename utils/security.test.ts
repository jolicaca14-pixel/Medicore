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

import { isSystemAdmin, hasAdministrativeAccess, maskIdentification } from './security';
import { UserRole } from '../types';

const testRBAC = () => {
    console.log('Testing RBAC helpers...');
    const adminUser: any = { roles: [UserRole.ADMIN] };
    const managerUser: any = { roles: [UserRole.MANAGER] };
    const profUser: any = { roles: [UserRole.PROFESSIONAL] };

    console.assert(isSystemAdmin(adminUser) === true, 'Admin should be System Admin');
    console.assert(isSystemAdmin(managerUser) === false, 'Manager should NOT be System Admin');
    console.assert(isSystemAdmin(null) === false, 'Null user should NOT be System Admin');

    console.assert(hasAdministrativeAccess(adminUser) === true, 'Admin should have admin access');
    console.assert(hasAdministrativeAccess(managerUser) === true, 'Manager should have admin access');
    console.assert(hasAdministrativeAccess(profUser) === false, 'Prof should NOT have admin access');

    console.assert(maskIdentification('12345678') === '***5678', 'ID Masking failed');
    console.assert(maskIdentification('123') === '123', 'ID Masking short ID failed');

    console.log('All RBAC tests passed.');
};

// Auto-execute if run directly
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    testSanitizeInput();
    testRBAC();
}
