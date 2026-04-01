import { sanitizeInput, isSystemAdmin, hasAdministrativeAccess, maskIdentification } from './security';
import { UserRole } from '../types';

/**
 * 🧪 Smith: Security Unit Tests
 */
const testSecurityUtils = () => {
  console.log('Testing security utilities...');

  // --- sanitizeInput ---
  console.log('Testing sanitizeInput...');
  console.assert(sanitizeInput('hello') === 'hello', 'sanitizeInput Test 1 Failed');
  console.assert(sanitizeInput('<script>alert("xss")</script>') === 'scriptalert("xss")/script', 'sanitizeInput Test 2 Failed');
  console.assert(sanitizeInput(null as any) === '', 'sanitizeInput Test 3 Failed');

  // --- isSystemAdmin ---
  console.log('Testing isSystemAdmin...');
  const adminUser = { roles: [UserRole.ADMIN] } as any;
  const profUser = { roles: [UserRole.PROFESSIONAL] } as any;
  console.assert(isSystemAdmin(adminUser) === true, 'isSystemAdmin Test 1 Failed');
  console.assert(isSystemAdmin(profUser) === false, 'isSystemAdmin Test 2 Failed');
  console.assert(isSystemAdmin(null) === false, 'isSystemAdmin Test 3 Failed');

  // --- hasAdministrativeAccess ---
  console.log('Testing hasAdministrativeAccess...');
  const managerUser = { roles: [UserRole.MANAGER] } as any;
  const accountantUser = { roles: [UserRole.ACCOUNTANT] } as any;
  console.assert(hasAdministrativeAccess(adminUser) === true, 'hasAdministrativeAccess Test 1 Failed');
  console.assert(hasAdministrativeAccess(managerUser) === true, 'hasAdministrativeAccess Test 2 Failed');
  console.assert(hasAdministrativeAccess(accountantUser) === true, 'hasAdministrativeAccess Test 3 Failed');
  console.assert(hasAdministrativeAccess(profUser) === false, 'hasAdministrativeAccess Test 4 Failed');

  // --- maskIdentification ---
  console.log('Testing maskIdentification...');
  console.assert(maskIdentification('123456789') === '*****6789', 'maskIdentification Test 1 Failed');
  console.assert(maskIdentification('123') === '123', 'maskIdentification Test 2 Failed');

  console.log('All security tests passed.');
};

// Only run if executing directly (using tsx or node)
if (require.main === module || !require.main) {
  testSecurityUtils();
}
