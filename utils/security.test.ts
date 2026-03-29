import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeInput, hasAdministrativeAccess, isSystemAdmin } from './security';
import { UserRole } from '../types';

test('Security Utilities', async (t) => {
  await t.test('sanitizeInput should remove < and >', () => {
    assert.strictEqual(sanitizeInput('hello'), 'hello');
    assert.strictEqual(sanitizeInput('<script>'), 'script');
    assert.strictEqual(sanitizeInput('<div>'), 'div');
    assert.strictEqual(sanitizeInput(null), '');
  });

  await t.test('hasAdministrativeAccess should validate roles', () => {
    assert.strictEqual(hasAdministrativeAccess([UserRole.ADMIN]), true);
    assert.strictEqual(hasAdministrativeAccess([UserRole.MANAGER]), true);
    assert.strictEqual(hasAdministrativeAccess([UserRole.ACCOUNTANT]), true);
    assert.strictEqual(hasAdministrativeAccess([UserRole.PROFESSIONAL]), false);
    assert.strictEqual(hasAdministrativeAccess([UserRole.SECRETARY]), false);
  });

  await t.test('isSystemAdmin should only allow ADMIN', () => {
    assert.strictEqual(isSystemAdmin([UserRole.ADMIN]), true);
    assert.strictEqual(isSystemAdmin([UserRole.MANAGER]), false);
    assert.strictEqual(isSystemAdmin([UserRole.PROFESSIONAL]), false);
  });
});
