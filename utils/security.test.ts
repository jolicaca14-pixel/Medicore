import test from 'node:test';
import assert from 'node:assert';
import { sanitizeInput, maskIdentification, hasAdministrativeAccess } from './security';
import { UserRole } from '../types';

test('sanitizeInput should remove < and > tags', () => {
  assert.strictEqual(sanitizeInput('hello'), 'hello');
  assert.strictEqual(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert("xss")/script');
  assert.strictEqual(sanitizeInput('<div><b>Bold</b></div>'), 'divbBold/b/div');
  assert.strictEqual(sanitizeInput(null as any), '');
  assert.strictEqual(sanitizeInput(undefined as any), '');
});

test('maskIdentification should hide middle characters', () => {
  assert.strictEqual(maskIdentification('1234567890'), '123****890');
  assert.strictEqual(maskIdentification('123'), '123');
  assert.strictEqual(maskIdentification('12345'), '123****345');
});

test('hasAdministrativeAccess should return true for admin roles', () => {
  assert.strictEqual(hasAdministrativeAccess([UserRole.ADMIN]), true);
  assert.strictEqual(hasAdministrativeAccess([UserRole.MANAGER]), true);
  assert.strictEqual(hasAdministrativeAccess([UserRole.ACCOUNTANT]), true);
  assert.strictEqual(hasAdministrativeAccess([UserRole.PROFESSIONAL]), false);
  assert.strictEqual(hasAdministrativeAccess([UserRole.ADMIN, UserRole.PROFESSIONAL]), true);
});
