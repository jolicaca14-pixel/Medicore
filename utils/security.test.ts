import test from 'node:test';
import assert from 'node:assert/strict';
import { hasAdministrativeAccess, maskIdentification, sanitizeInput } from './security';
import { User, UserRole } from '../types';

test('sanitizeInput removes basic HTML tags', () => {
    assert.strictEqual(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert("xss")/script');
    assert.strictEqual(sanitizeInput('<b>Hello</b>'), 'bHello/b');
    assert.strictEqual(sanitizeInput('Plain text'), 'Plain text');
});

test('hasAdministrativeAccess identifies admin roles', () => {
    const adminUser = { roles: [UserRole.ADMIN] } as User;
    const managerUser = { roles: [UserRole.MANAGER] } as User;
    const accountantUser = { roles: [UserRole.ACCOUNTANT] } as User;
    const professionalUser = { roles: [UserRole.PROFESSIONAL] } as User;
    const guestUser = { roles: [] } as User;

    assert.strictEqual(hasAdministrativeAccess(adminUser), true);
    assert.strictEqual(hasAdministrativeAccess(managerUser), true);
    assert.strictEqual(hasAdministrativeAccess(accountantUser), true);
    assert.strictEqual(hasAdministrativeAccess(professionalUser), false);
    assert.strictEqual(hasAdministrativeAccess(guestUser), false);
    assert.strictEqual(hasAdministrativeAccess(null), false);
});

test('maskIdentification obscures identification strings', () => {
    assert.strictEqual(maskIdentification('123456789'), '123****89');
    assert.strictEqual(maskIdentification('12345'), '123****45');
    assert.strictEqual(maskIdentification('123'), '123');
    assert.strictEqual(maskIdentification(''), '');
    assert.strictEqual(maskIdentification(null as any), '');
});
