import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeInput, hasAdministrativeAccess } from './security';
import { UserRole, User } from '../types';

test('sanitizeInput', () => {
  assert.strictEqual(sanitizeInput('hello'), 'hello');
  assert.strictEqual(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert("xss")/script');
  assert.strictEqual(sanitizeInput('<div><b>Bold</b></div>'), 'divbBold/b/div');
  assert.strictEqual(sanitizeInput(null as any), '');
  assert.strictEqual(sanitizeInput(undefined as any), '');
});

test('hasAdministrativeAccess', () => {
  const adminUser: User = { roles: [UserRole.ADMIN] } as User;
  const managerUser: User = { roles: [UserRole.MANAGER] } as User;
  const accountantUser: User = { roles: [UserRole.ACCOUNTANT] } as User;
  const healthUser: User = { roles: [UserRole.PROFESSIONAL] } as User;
  const mixedUser: User = { roles: [UserRole.PROFESSIONAL, UserRole.MANAGER] } as User;

  assert.strictEqual(hasAdministrativeAccess(adminUser), true);
  assert.strictEqual(hasAdministrativeAccess(managerUser), true);
  assert.strictEqual(hasAdministrativeAccess(accountantUser), true);
  assert.strictEqual(hasAdministrativeAccess(healthUser), false);
  assert.strictEqual(hasAdministrativeAccess(mixedUser), true);
  assert.strictEqual(hasAdministrativeAccess(null), false);
  assert.strictEqual(hasAdministrativeAccess({ roles: [] } as any), false);
});
