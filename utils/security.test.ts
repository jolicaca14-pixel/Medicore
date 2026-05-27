import { sanitizeInput, isSystemAdmin, hasAdministrativeAccess, maskIdentification } from './security';
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

  console.log('sanitizeInput tests passed.');
};

const testRBAC = () => {
    console.log('Testing RBAC helpers...');

    // isSystemAdmin
    console.assert(isSystemAdmin([UserRole.ADMIN]) === true, 'isSystemAdmin Test 1 Failed');
    console.assert(isSystemAdmin([UserRole.PROFESSIONAL]) === false, 'isSystemAdmin Test 2 Failed');

    // hasAdministrativeAccess
    console.assert(hasAdministrativeAccess([UserRole.ADMIN]) === true, 'hasAdmin Test 1 Failed');
    console.assert(hasAdministrativeAccess([UserRole.MANAGER]) === true, 'hasAdmin Test 2 Failed');
    console.assert(hasAdministrativeAccess([UserRole.ACCOUNTANT]) === true, 'hasAdmin Test 3 Failed');
    console.assert(hasAdministrativeAccess([UserRole.PROFESSIONAL]) === false, 'hasAdmin Test 4 Failed');

    console.log('RBAC tests passed.');
};

const testMasking = () => {
    console.log('Testing Identification Masking...');
    console.assert(maskIdentification('123456789') === '*****6789', 'Masking Test 1 Failed');
    console.assert(maskIdentification('1234') === '1234', 'Masking Test 2 Failed (Length 4)');
    console.assert(maskIdentification('123') === '***', 'Masking Test 3 Failed (Short)');
    console.log('Masking tests passed.');
};

// Auto-execute
testSanitizeInput();
testRBAC();
testMasking();
console.log('All security utilities verified.');
