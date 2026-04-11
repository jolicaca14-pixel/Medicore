import { sanitizeInput, isSystemAdmin, hasAdministrativeAccess, maskIdentification } from './security';
import { User, UserRole } from '../types';

/**
 * 🧪 Security and RBAC Unit Tests
 */
const testSanitizeInput = () => {
  console.log('Testing sanitizeInput...');
  console.assert(sanitizeInput('hello') === 'hello', 'Test 1 Failed');
  console.assert(sanitizeInput('<script>alert("xss")</script>') === 'scriptalert("xss")/script', 'Test 2 Failed');
  console.assert(sanitizeInput(null as any) === '', 'Test 3 Failed');
};

const testRBAC = () => {
  console.log('Testing RBAC Utilities...');

  const adminUser: User = { id: '1', roles: [UserRole.ADMIN], name: 'Admin', username: 'admin', documentNumber: '123' };
  const managerUser: User = { id: '2', roles: [UserRole.MANAGER], name: 'Manager', username: 'manager', documentNumber: '456' };
  const professionalUser: User = { id: '3', roles: [UserRole.PROFESSIONAL], name: 'Doc', username: 'doc', documentNumber: '789' };

  console.assert(isSystemAdmin(adminUser) === true, 'Admin should be System Admin');
  console.assert(isSystemAdmin(managerUser) === false, 'Manager should NOT be System Admin');

  console.assert(hasAdministrativeAccess(adminUser) === true, 'Admin should have administrative access');
  console.assert(hasAdministrativeAccess(managerUser) === true, 'Manager should have administrative access');
  console.assert(hasAdministrativeAccess(professionalUser) === false, 'Professional should NOT have administrative access');
};

const testPII = () => {
    console.log('Testing PII protection...');
    console.assert(maskIdentification('12345678') === '****5678', 'Identification should be masked');
    console.assert(maskIdentification('123') === '****', 'Short ID should be fully masked');
};

console.log('--- STARTING SECURITY TESTS ---');
testSanitizeInput();
testRBAC();
testPII();
console.log('--- ALL SECURITY TESTS PASSED ---');
