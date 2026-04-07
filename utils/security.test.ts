import { sanitizeInput, hasAdministrativeAccess, isSystemAdmin } from './security';
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

  console.log('sanitizeInput tests passed.');
};

const testRBAC = () => {
    console.log('Testing RBAC utilities...');

    const adminUser = { roles: [UserRole.ADMIN] } as User;
    const managerUser = { roles: [UserRole.MANAGER] } as User;
    const accountantUser = { roles: [UserRole.ACCOUNTANT] } as User;
    const professionalUser = { roles: [UserRole.PROFESSIONAL] } as User;

    // Test hasAdministrativeAccess
    console.assert(hasAdministrativeAccess(adminUser) === true, 'Admin should have admin access');
    console.assert(hasAdministrativeAccess(managerUser) === true, 'Manager should have admin access');
    console.assert(hasAdministrativeAccess(accountantUser) === true, 'Accountant should have admin access');
    console.assert(hasAdministrativeAccess(professionalUser) === false, 'Professional should NOT have admin access');
    console.assert(hasAdministrativeAccess(null) === false, 'Null should NOT have admin access');

    // Test isSystemAdmin
    console.assert(isSystemAdmin(adminUser) === true, 'Admin is system admin');
    console.assert(isSystemAdmin(managerUser) === false, 'Manager is NOT system admin');
    console.assert(isSystemAdmin(professionalUser) === false, 'Professional is NOT system admin');

    console.log('RBAC tests passed.');
};

// Auto-execute if run directly
testSanitizeInput();
testRBAC();
