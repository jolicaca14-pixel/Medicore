import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeInput, hasAdministrativeAccess } from './security';
import { UserRole, User } from '../types';

test('sanitizeInput', async (t) => {
  await t.test('should return empty string for null or undefined', () => {
    assert.strictEqual(sanitizeInput(null), '');
    assert.strictEqual(sanitizeInput(undefined), '');
  });

  await t.test('should remove < and > characters', () => {
    assert.strictEqual(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert("xss")/script');
    assert.strictEqual(sanitizeInput('<b>Hello</b>'), 'bHello/b');
  });

  await t.test('should leave normal strings alone', () => {
    assert.strictEqual(sanitizeInput('Hello World'), 'Hello World');
    assert.strictEqual(sanitizeInput('12345'), '12345');
  });
});

test('hasAdministrativeAccess', async (t) => {
  const adminUser: Partial<User> = { roles: [UserRole.ADMIN] };
  const managerUser: Partial<User> = { roles: [UserRole.MANAGER] };
  const accountantUser: Partial<User> = { roles: [UserRole.ACCOUNTANT] };
  const professionalUser: Partial<User> = { roles: [UserRole.PROFESSIONAL] };
  const multipleRolesUser: Partial<User> = { roles: [UserRole.PROFESSIONAL, UserRole.MANAGER] };

  await t.test('should return true for ADMIN, MANAGER, or ACCOUNTANT', () => {
    assert.strictEqual(hasAdministrativeAccess(adminUser as User), true);
    assert.strictEqual(hasAdministrativeAccess(managerUser as User), true);
    assert.strictEqual(hasAdministrativeAccess(accountantUser as User), true);
  });

  await t.test('should return true if at least one role is administrative', () => {
    assert.strictEqual(hasAdministrativeAccess(multipleRolesUser as User), true);
  });

  await t.test('should return false for non-administrative roles', () => {
    assert.strictEqual(hasAdministrativeAccess(professionalUser as User), false);
  });

  await t.test('should return false for undefined user', () => {
    assert.strictEqual(hasAdministrativeAccess(undefined), false);
  });
});
