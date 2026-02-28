import { sanitizeInput, hasAdministrativeAccess, maskIdentification } from './security';
import { UserRole } from '../types';

/**
 * 🧪 Security Unit Tests
 */
const testSecurityUtils = () => {
  console.log('Testing security utilities...');

  // --- sanitizeInput ---
  console.assert(sanitizeInput('hello') === 'hello', 'sanitizeInput Test 1 Failed');
  const input2 = '<script>alert("xss")</script>';
  const expected2 = 'scriptalert("xss")/script';
  console.assert(sanitizeInput(input2) === expected2, 'sanitizeInput Test 2 Failed');
  console.assert(sanitizeInput(null as any) === '', 'sanitizeInput Test 3 Failed');

  // --- hasAdministrativeAccess ---
  const adminUser: any = { roles: [UserRole.ADMIN] };
  const managerUser: any = { roles: [UserRole.MANAGER] };
  const accountantUser: any = { roles: [UserRole.ACCOUNTANT] };
  const professionalUser: any = { roles: [UserRole.PROFESSIONAL] };

  console.assert(hasAdministrativeAccess(adminUser) === true, 'hasAdministrativeAccess Admin Failed');
  console.assert(hasAdministrativeAccess(managerUser) === true, 'hasAdministrativeAccess Manager Failed');
  console.assert(hasAdministrativeAccess(accountantUser) === true, 'hasAdministrativeAccess Accountant Failed');
  console.assert(hasAdministrativeAccess(professionalUser) === false, 'hasAdministrativeAccess Professional Failed');
  console.assert(hasAdministrativeAccess(null) === false, 'hasAdministrativeAccess Null Failed');

  // --- maskIdentification ---
  console.assert(maskIdentification('1234567890') === '123****890', 'maskIdentification Long Failed');
  console.assert(maskIdentification('123456') === '123456', 'maskIdentification Short Failed');
  console.assert(maskIdentification('') === '', 'maskIdentification Empty Failed');

  console.log('All security tests passed.');
};

testSecurityUtils();
